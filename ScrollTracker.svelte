<script lang="ts">
	import { browser } from '$app/environment';		
	import type { Snippet } from 'svelte';

	// --- Define Props Interface ---
	interface Props {
		children: Snippet;
		/** Start mapping progress when raw progress > this value (0-1) */
		startThreshold?: number;
		/** Finish mapping progress when raw progress reaches this value (0-1) */
		endThreshold?: number;
		debug?: boolean;
	}

	// --- Props ---
	let {
		children,
		startThreshold = 0, // Default: start immediately
		endThreshold = 0.5,   // Default: end when fully scrolled past
		debug = false
	}: Props = $props();

	// --- State & Refs ---
	let element: HTMLDivElement | null = null;
	let isIntersecting = $state(false);
	let rafId: number | null = null;

	// --- Intersection Observer Effect ---
	$effect(() => {
		if (!browser || !element) return;
		// Initialize CSS var - reflects clamped start state
		const initialProgress = Math.max(0, Math.min(1, (0 - startThreshold) / (endThreshold - startThreshold) || 0));
		element.style.setProperty('--scroll-progress', String(initialProgress));

		const observer = new IntersectionObserver(
			([entry]: IntersectionObserverEntry[]) => {
				isIntersecting = entry.isIntersecting;
				if (debug) console.log('Intersection Changed:', entry.isIntersecting);

				if (!entry.isIntersecting) {
					if (rafId) {
						cancelAnimationFrame(rafId);
						rafId = null;
					}
					// Determine final progress based on exit position & thresholds
					const vh = window.innerHeight; // Need viewport height for raw calc
					const rect = entry.boundingClientRect;
					const elHeight = rect.height;
                    const rawProgress = (vh - rect.top) / (vh + elHeight);
                    // Use the same mapping logic to determine final state (0 or 1)
                    const rangeStart = startThreshold;
                    const rangeEnd = endThreshold;
                    const rangeLength = rangeEnd - rangeStart;
                    let finalProgress = 0;
                    if (rangeLength > 0) {
                        finalProgress = (rawProgress - rangeStart) / rangeLength;
                    } else {
                        finalProgress = rawProgress >= rangeStart ? 1 : 0;
                    }
                    finalProgress = Math.max(0, Math.min(1, finalProgress));

					const currentElement = element;
					requestAnimationFrame(() => {
						if (currentElement) {
							currentElement.style.setProperty('--scroll-progress', String(finalProgress));
						}
						if (debug) console.log(`Exited Viewport. Raw: ${rawProgress.toFixed(3)}, Final Progress: ${finalProgress}`);
					});
				} else {
					handleScroll(); // Initial calculation on entry
				}
			},
			{ threshold: 0.0 }
		);
		observer.observe(element);
		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			observer.disconnect();
		};
	});

	// --- Scroll Listener Effect ---
	$effect(() => {
		if (!browser) return;
		if (isIntersecting) {
			if (debug) console.log('Adding scroll listener');
			window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
			handleScroll(); // Initial calculation
			return () => {
				if (debug) console.log('Removing scroll listener');
				window.removeEventListener('scroll', handleScroll, { capture: true });
				if (rafId) {
					cancelAnimationFrame(rafId);
					rafId = null;
				}
			};
		}
	});

	// --- Scroll Handler (Throttled) ---
	function handleScroll(): void {
		if (rafId) return;
		rafId = requestAnimationFrame(() => {
			if (!element) { rafId = null; return; }

			const vh: number = window.innerHeight;
			const rect: DOMRect = element.getBoundingClientRect();
			const elTop: number = rect.top;
			const elHeight: number = rect.height;

			if (elHeight === 0 && vh === 0) { rafId = null; return; }

			// Raw progress (0 = top entering bottom, 1 = bottom leaving top)
			const rawProgress: number = (vh - elTop) / (vh + elHeight);

			// Define the active range based on props
			const rangeStart = startThreshold;
			const rangeEnd = endThreshold;
			const rangeLength = rangeEnd - rangeStart;

			let currentProgress: number = 0;
			if (rangeLength > 0) {
				// Map rawProgress within the active range [rangeStart, rangeEnd] to 0-1 output
				currentProgress = (rawProgress - rangeStart) / rangeLength;
			} else {
                // Handle edge case: range is zero or negative
                currentProgress = rawProgress >= rangeStart ? 1 : 0;
            }

			// Clamp final progress to ensure it stays within 0-1 boundaries
			currentProgress = Math.max(0, Math.min(1, currentProgress));

			element.style.setProperty('--scroll-progress', String(currentProgress));

			if (debug) {
				console.log(`Scroll Update: Raw=${rawProgress.toFixed(3)}, Mapped=${currentProgress.toFixed(3)} (Range ${rangeStart}-${rangeEnd})`);
			}
			rafId = null;
		});
	}
</script>

<div bind:this={element}>
	{@render children?.()}
</div>
