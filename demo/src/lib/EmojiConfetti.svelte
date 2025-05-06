<script lang="ts">
	import { onMount, tick } from 'svelte';

	// Props
	let {
		emojis = ['💩'],
		trigger = false,
		count = 30,
		size = '1.8rem'
	}: {
		emojis?: string[];
		trigger?: boolean;
		count?: number;
		size?: string;
	} = $props();

	// State for particles
	let particles = $state<
		{
			id: number;
			emoji: string;
			x: number;
			y: number;
			initialRotation: number;
			horizontalDrift: number;
			particleSize: string;
		}[]
	>([]);
	let nextId = $state(0);

	function fireConfetti() {
		const newParticles = [];
		for (let i = 0; i < count; i++) {
			const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
			newParticles.push({
				id: nextId++,
				emoji: randomEmoji,
				x: Math.random() * 100,
				y: Math.random() * 100 - 100, // User's preferred: -100% to 0% top
				initialRotation: Math.random() * 360,
				horizontalDrift: (Math.random() - 0.5) * 60, // +/- 30vw
				particleSize: size
			});
		}
		particles = [...particles, ...newParticles];

		setTimeout(() => {
			const currentIds = new Set(newParticles.map((p) => p.id));
			particles = particles.filter((p) => !currentIds.has(p.id));
		}, 4600); // For 4.5s animation
	}

	export { fireConfetti };

	// Effect and Mount Logic to prevent firing on initial mount
	let canCheckForTrigger = $state(false);
	let prevTrigger = $state(trigger);

	onMount(async () => {
		// Sync prevTrigger with the actual prop value AT MOUNT
		// This ensures that on the first run of the $effect after this,
		// prevTrigger correctly reflects the initial state.
		prevTrigger = trigger;
		await tick();
		canCheckForTrigger = true; // Allow the $effect's main logic to run
	});

	$effect(() => {
		if (!canCheckForTrigger) {
			// Don't run confetti logic until onMount has explicitly allowed it
			// and prevTrigger has been synced.
			return;
		}

		if (trigger && !prevTrigger) {
			fireConfetti();
		}
		prevTrigger = trigger;
	});
</script>

<div class="confetti-container">
	{#each particles as particle (particle.id)}
		<div
			class="particle"
			style="
                left: {particle.x}%; 
                top: {particle.y}%; 
                font-size: {particle.particleSize};
                --initial-rotation: {particle.initialRotation}deg;
                --horizontal-drift: {particle.horizontalDrift}vw;
            "
		>
			{particle.emoji}
		</div>
	{/each}
</div>

<style>
	.confetti-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		pointer-events: none;
		z-index: 9999;
	}

	.particle {
		position: absolute;
		will-change: transform, opacity;
		user-select: none;
		opacity: 0; /* Start transparent, animation brings to 1 */
		transform-origin: center center;
		color: currentColor; /* Inherits text color, good for emojis */

		animation-name: fall-confetti-final;
		animation-duration: 4.5s;
		animation-timing-function: ease-out;
		animation-fill-mode: forwards;
	}

	@keyframes fall-confetti-final {
		0% {
			opacity: 1;
			transform: translate(-50%, -50%) translateY(0vh) translateX(0vw)
				rotate(var(--initial-rotation));
		}
		100% {
			opacity: 1; /* Remain opaque as it falls out of view */
			transform: translate(-50%, -50%) translateY(220vh) /* Fall well below the viewport */
				translateX(var(--horizontal-drift)) rotate(calc(var(--initial-rotation) + 720deg)); /* Spin at least twice */
		}
	}
</style>
