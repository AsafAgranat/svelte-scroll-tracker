<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	// --- Define Props Interface ---
	interface Props {
		/** The content snippet that will receive the scroll progress */
		children: Snippet<[progress: number]>; // Snippet accepts a 'progress' number
		/** Start mapping progress when raw progress > this value (0-1) */
		startThreshold?: number;
		/** Finish mapping progress when raw progress reaches this value (0-1) */
		endThreshold?: number;
		/** Enable console logging for debug purposes */
		debug?: boolean;
		id?: string;
	}

	// --- Internal State for Progress ---
	let internalProgress = $state(0);

	// --- Props ---
	let {
		children,
		startThreshold = 0, // Default: start immediately
		endThreshold = 0.5, // Default: end when element's top reaches halfway through viewport
		debug = false,
		id
	}: Props = $props();

	// --- State & Refs ---
	let element: HTMLDivElement | null = null; // Bound to the wrapping div
	let isIntersecting = $state(false); // Is the element currently in the viewport?
	let rafId: number | null = null; // ID for requestAnimationFrame to throttle scroll events

	// --- Intersection Observer Effect ---
	// Manages whether the scroll listener is active and handles edge cases for entering/leaving viewport
	$effect(() => {
		if (!browser || !element) return;

		// Initialize CSS var and internal state with the calculated progress as if scrolled to top (0)
		const initialRawProgress =
			(window.innerHeight - 0) / (window.innerHeight + (element.offsetHeight || 0)); // Approximate raw progress at top
		let initialMappedProgress = 0;
		const rangeStartInitial = startThreshold;
		const rangeEndInitial = endThreshold;
		const rangeLengthInitial = rangeEndInitial - rangeStartInitial;

		if (rangeLengthInitial > 0) {
			initialMappedProgress = (initialRawProgress - rangeStartInitial) / rangeLengthInitial;
		} else {
			initialMappedProgress = initialRawProgress >= rangeStartInitial ? 1 : 0;
		}
		initialMappedProgress = Math.max(0, Math.min(1, initialMappedProgress));

		element.style.setProperty('--scroll-progress', String(initialMappedProgress));
		internalProgress = initialMappedProgress;

		const observer = new IntersectionObserver(
			([entry]: IntersectionObserverEntry[]) => {
				const currentlyIntersecting = entry.isIntersecting;
				if (debug && isIntersecting !== currentlyIntersecting) {
					// Log only on change
					console.log(
						`Intersection Changed (Element ${element?.id || 'N/A'}):`,
						currentlyIntersecting,
						entry.boundingClientRect
					);
				}
				isIntersecting = currentlyIntersecting;

				if (!isIntersecting) {
					// Element has left the viewport
					if (rafId) {
						cancelAnimationFrame(rafId);
						rafId = null;
					}
					// Determine final progress based on exit position relative to thresholds
					const vh = window.innerHeight;
					const rect = entry.boundingClientRect; // Get the *final* rect before it's gone
					const elHeight = rect.height;

					// Raw progress: 0 when element's top enters viewport bottom, 1 when element's bottom leaves viewport top
					const rawProgressOnExit = (vh - rect.top) / (vh + elHeight || 1); // Avoid division by zero if elHeight is 0

					const rangeStart = startThreshold;
					const rangeEnd = endThreshold;
					const rangeLength = rangeEnd - rangeStart;
					let finalProgressValue = 0;

					if (rangeLength > 0) {
						finalProgressValue = (rawProgressOnExit - rangeStart) / rangeLength;
					} else {
						// If range is zero or negative, progress is binary based on startThreshold
						finalProgressValue = rawProgressOnExit >= rangeStart ? 1 : 0;
					}
					finalProgressValue = Math.max(0, Math.min(1, finalProgressValue)); // Clamp to 0-1

					const currentElementRef = element; // Capture ref for async update
					requestAnimationFrame(() => {
						// Ensure style is set even if raf was cancelled
						if (currentElementRef) {
							currentElementRef.style.setProperty('--scroll-progress', String(finalProgressValue));
						}
						internalProgress = finalProgressValue;
						if (debug)
							console.log(
								`Exited Viewport (Element ${currentElementRef?.id || 'N/A'}). Raw: ${rawProgressOnExit.toFixed(3)}, Final Mapped: ${finalProgressValue.toFixed(3)}`
							);
					});
				} else {
					// Element has entered or is moving within the viewport
					handleScroll(); // Perform initial calculation on entry or if already visible
				}
			},
			{ threshold: [0.0, 0.001, 0.999, 1.0] } // Multiple thresholds for more precise entry/exit
		);

		observer.observe(element);

		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			observer.disconnect();
			if (debug) console.log(`Observer disconnected (Element ${element?.id || 'N/A'})`);
		};
	});

	// --- Scroll Listener Effect ---
	// Adds/removes the main scroll event listener based on viewport intersection
	$effect(() => {
		if (!browser) return;

		if (isIntersecting) {
			if (debug) console.log(`Adding scroll listener (Element ${element?.id || 'N/A'})`);
			window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
			handleScroll(); // Perform an initial calculation when becoming active
			return () => {
				if (debug) console.log(`Removing scroll listener (Element ${element?.id || 'N/A'})`);
				window.removeEventListener('scroll', handleScroll, { capture: true });
				if (rafId) {
					// Clean up any pending animation frame
					cancelAnimationFrame(rafId);
					rafId = null;
				}
			};
		} else {
			// Ensure rafId is cleared if we are no longer intersecting and listener is removed
			if (rafId) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
		}
	});

	// --- Scroll Handler (Throttled with requestAnimationFrame) ---
	// Calculates and applies the scroll progress
	function handleScroll(): void {
		if (!element || !isIntersecting) {
			// Don't run if not visible or element is gone
			if (rafId) {
				// Clear pending frame if conditions are no longer met
				cancelAnimationFrame(rafId);
				rafId = null;
			}
			return;
		}
		if (rafId) return; // Already scheduled an update

		rafId = requestAnimationFrame(() => {
			if (!element || !isIntersecting) {
				// Re-check in case state changed before raf executes
				rafId = null;
				return;
			}

			const vh: number = window.innerHeight;
			const rect: DOMRect = element.getBoundingClientRect();
			const elTop: number = rect.top;
			const elHeight: number = rect.height;

			// Avoid division by zero or non-sensical calculations if element has no height or viewport is zero
			if (elHeight === 0 && vh === 0) {
				rafId = null;
				return;
			}

			// Raw progress: 0 when element's top enters viewport bottom, 1 when element's bottom leaves viewport top
			const rawProgress: number = (vh - elTop) / (vh + elHeight || 1); // Avoid division by zero

			// Define the active range for progress mapping based on props
			const rangeStart = startThreshold;
			const rangeEnd = endThreshold;
			const rangeLength = rangeEnd - rangeStart;

			let currentMappedProgress: number = 0;
			if (rangeLength > 0) {
				// Map rawProgress within the active range [rangeStart, rangeEnd] to an output of 0-1
				currentMappedProgress = (rawProgress - rangeStart) / rangeLength;
			} else {
				// Handle edge case: if range is zero or negative, progress is binary
				currentMappedProgress = rawProgress >= rangeStart ? 1 : 0;
			}

			// Clamp final progress to ensure it always stays within 0-1 boundaries
			currentMappedProgress = Math.max(0, Math.min(1, currentMappedProgress));

			element.style.setProperty('--scroll-progress', String(currentMappedProgress));
			internalProgress = currentMappedProgress; // Update the internal state

			if (debug) {
				console.log(
					`Scroll Update (Element ${element?.id || 'N/A'}): Raw=${rawProgress.toFixed(3)}, Mapped=${currentMappedProgress.toFixed(3)} (Range ${rangeStart}-${rangeEnd})`
				);
			}
			rafId = null; // Clear ID for next frame
		});
	}
</script>

<div bind:this={element} {id}>
	{@render children(internalProgress)}
</div>
