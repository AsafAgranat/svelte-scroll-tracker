<script lang="ts">
	// Demo page for svelte-scroll-tracker
	// This file demonstrates various creative uses of the ScrollTracker component.

	import { generateAndApplyDuotoneColors } from '../lib/duotone';
	import EmojiConfetti from '../lib/EmojiConfetti.svelte';
	import ScrollTracker from '../../../src/ScrollTracker.svelte'; // Adjusted path
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	/* Variables for dynamic content examples */
	const revealText: string =
		'Each word starts obscured by a block. As you scroll, the block covering each word shrinks away horizontally, revealing the text. This entire sequence completes as the paragraph reaches the middle of the viewport.';
	const wordsAndSpaces: string[] = revealText.split(/(\s+)/); // Captures spaces for layout
	const imgSrc: string =
		'https://plus.unsplash.com/premium_photo-1670590820797-51389452a3c3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	// Controls the deferred mounting of the EmojiConfetti component.
	let mountable: boolean = $state(false);

	onMount(() => {
		// Applies a visual theme for the demo page.
		generateAndApplyDuotoneColors();
		// Delays mounting the confetti component, e.g., for UX or performance.
		setTimeout(() => {
			mountable = true;
		}, 2000);
	});
</script>

<svelte:head>
	<title>ScrollTracker Component Demo | Svelte</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="page-content">
	<header class="intro-header">
		<h1>Svelte Scroll Tracker Demo</h1>
		<p>A Svelte component driving animations based on scroll progress across the viewport.</p>
		<nav>
			<a
				href="https://github.com/AsafAgranat/svelte-scroll-tracker"
				target="_blank"
				rel="noopener noreferrer">GitHub</a
			>
			<a
				href="https://www.npmjs.com/package/svelte-scroll-tracker"
				target="_blank"
				rel="noopener noreferrer">npm</a
			>
		</nav>

		<div class="instructions">
			<p>
				Scroll down to see different <b>examples</b> powered by the <code>--scroll-progress</code> CSS
				variable (0 to 1).
			</p>
		</div>
	</header>

	<section class="demo-section">
		<h2>Fade & Slide Up</h2>
		<div class="effect-label">0-50% Journey (default)</div>
		<ScrollTracker>
			<article class="content-box animate-fade-slide">
				<h3>Smooth Entrance</h3>
				<p>
					The most basic effect, fading and sliding into view smoothly across the viewport scroll.
				</p>
				<img src={imgSrc} alt="Nature placeholder" loading="lazy" />
			</article>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>Scale In & Translate Up</h2>
		<div class="effect-label">0-40% Journey</div>
		<ScrollTracker startThreshold={0} endThreshold={0.4}>
			<article class="content-box animate-scale">
				<h3>Quick Growth</h3>
				<p>
					This element scales in and moves up, completing its animation by the time it reaches the
					middle of the screen.
				</p>
			</article>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>fly in from the side</h2>
		<div class="effect-label">0-50% Journey (default)</div>
		<ScrollTracker startThreshold={0} endThreshold={0.5}>
			<article class="content-box animate-fly-in-from-side">
				<h3>Smooth Side Entrance</h3>
				<p>A horizontal slide</p>
			</article>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>Color Change</h2>
		<div class="effect-label">30%-100% Journey</div>
		<ScrollTracker startThreshold={0.3} endThreshold={1}>
			<article class="content-box animate-color">
				<h3>Mid-Scroll Shift</h3>
				<p>
					The background color shifts only during the middle part of its journey across the
					viewport.
				</p>
			</article>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>Horizontal Reveal</h2>
		<div class="effect-label">10%-60% Journey</div>
		<ScrollTracker startThreshold={0.1} endThreshold={0.6}>
			<article class="content-box animate-reveal">
				<h3>Unveiling Content</h3>
				<p>Using <code>clip-path</code> to reveal the content horizontally as you scroll.</p>
				<pre><code>clip-path: inset(0 calc(100% - 100% * var(--scroll-progress)) 0 0);</code></pre>
			</article>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>Width Expansion</h2>
		<div class="effect-label">0-50% Journey (default)</div>
		<ScrollTracker>
			<article class="content-box animate-width">
				<h3>Expanding Box</h3>
				<p>The container itself expands horizontally based on scroll progress.</p>
			</article>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>SVG Draw</h2>
		<div class="effect-label">10%-60% Journey</div>
		<ScrollTracker startThreshold={0.3} endThreshold={0.8}>
			<article class="content-box animate-svg">
				<p>Animating SVG stroke properties.</p>
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
					<path
						d="M 25 88 
       Q 50 100 75 88 
       C 90 85, 98 70, 75 65 
       C 85 55, 80 40, 65 35 
       C 63 25, 58 15, 52 12 
       C 40 15, 32 28, 35 40 
       C 20 50, 10 60, 22 70 
       C 12 75, 15 85, 25 88 Z"
						stroke="saddlebrown"
						stroke-width="5"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						id="poop-body"
					/>

					<ellipse
						cx="37"
						cy="58"
						rx="5"
						ry="7"
						stroke="saddlebrown"
						stroke-width="2"
						fill="none"
						id="eye-left"
					/>

					<ellipse
						cx="63"
						cy="56"
						rx="6"
						ry="8"
						stroke="saddlebrown"
						stroke-width="2"
						fill="none"
						id="eye-right"
					/>
				</svg>
			</article>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>Word Reveal</h2>
		<span class="effect-label">Staggered, 20%-50% Journey</span>
		<ScrollTracker startThreshold={0.2}>
			<p class="content-box animate-word-reveal">
				{#each wordsAndSpaces as segment, i (i)}
					{#if segment.trim().length > 0}
						<span class="word-block" style="--word-index: {i};">
							{segment}
						</span>
					{:else}
						{segment}
					{/if}
				{/each}
			</p>
		</ScrollTracker>
	</section>

	<section class="demo-section">
		<h2>Use it programmatically</h2>
		<span class="effect-label">Trigger at 50% Journey</span>
		<ScrollTracker startThreshold={0.2} endThreshold={0.8}>
			{#snippet children(progress: number)}
				<article class="content-box" style="display: inline-block;">
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<h4 style="display: flex;">
							<span>Progress: {(progress * 100).toFixed()}%</span>{#if progress > 0.5}<span transition:slide={{axis: 'x'}} style="white-space: nowrap">, with POOMOJIES! at 50%</span>{/if}
						</h4>
					</div>
					{#if mountable}
						<EmojiConfetti trigger={progress > 0.5} />
					{/if}
				</article>
			{/snippet}
		</ScrollTracker>
	</section>

	<footer class="outro-footer">
		<p>Experiment with the <code>startThreshold</code> and <code>endThreshold</code> props!</p>
	</footer>
</main>

<style lang="scss">
	/* --- Variables --- */
	:root {
		--font-body: 'IBM Plex Sans', sans-serif;
		--font-heading: 'IBM Plex Sans', sans-serif;
		--font-code: 'Source Code Pro', monospace;
		--color-text: var(--duotone-secondary);
		--color-primary: var(--duotone-secondary); /* Deep Purple */
		--color-accent: white; /* Pink accent */
		--color-bg: var(--duotone-primary);
		--color-box-bg: var(--duotone-secondary);
		--color-box-text: var(--duotone-primary);
		--border-radius: 8px;
		--box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
	}
	/* --- Global Styles --- */
	:global(body) {
		margin: 0;
		font-family: var(--font-body);
		background-color: var(--color-bg);
		color: var(--color-text);
		line-height: 1.7;

		&:global(.dark) {
			--color-text: var(--duotone-secondary);
			--color-bg: var(--duotone-primary);
		}
	}

	/* --- Page Layout --- */
	.page-content {
		padding: 0 0 5vh 0; /* Add more bottom padding */
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 100%;
		overflow-x: hidden;
	}

	p > code {
		background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
		color: var(--color-accent);
		padding: 0.1em 0.4em;
		border-radius: 4px;
		font-family: var(--font-code);
	}

	/* --- Header & Footer --- */
	.intro-header,
	.outro-footer {
		text-align: center;
		// margin-bottom: 10vh;
		// width: 90%;
		padding: 5vw;
		// max-width: 800px;
		max-width: 100%;
		width: 1000px;
		text-align: left;
		box-sizing: border-box;

		h1 {
			font-family: var(--font-heading);
			font-weight: 300;
			font-size: clamp(3rem, 15vw, 8rem);
			color: var(--color-primary);
			margin-bottom: 0.5rem;
			letter-spacing: -0.07em;
			line-height: 0.8em;
			code {
				font-size: inherit; /* Make code same size in heading */
				color: var(--color-accent);
				font-family: inherit;
			}
		}

		p {
			font-size: 1.1rem;
			color: var(--color-text);
			margin-bottom: 2rem;
			margin-top: 3rem;
			line-height: 1.4;
		}

		nav {
			display: flex;
			gap: 2rem;
			a {
				// margin: 0 1rem;
				color: var(--color-primary);
				text-decoration: none;
				font-weight: 600;
				font-size: 1.2rem;

				&:hover {
					text-decoration: underline;
					color: var(--color-accent);
				}
			}
		}
	}

	.intro-header {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		p {
			max-width: 360px;
			font-size: 1.2rem;
		}
	}
	.outro-footer {
		margin-top: 20vh;
		margin-bottom: 0;
		padding-bottom: 10vh;
		p {
			font-style: italic;
		}
	}

	.instructions {
		justify-self: flex-end;
		align-self: flex-end;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		// 	background-color: var(--color-bg);
		// 	padding: 1rem 2rem;
		// 	// border-radius: var(--border-radius);
		// 	// margin-bottom: 80vh;
		// 	// border-left: 4px solid var(--color-primary);
		p {
			margin: 0;
			font-size: 1.2rem;
		}
		code {
			display: inline-flex;
			// 		// background-color: var(--color-primary);
			// 		// box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 25%, transparent);
			// 		background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
			// 		color: var(--color-accent);
			// 		padding: 0.1em 0.4em;
			// 		border-radius: 4px;
			// 		font-family: var(--font-code);
		}
	}

	.demo-section {
		max-width: 100%;
		width: 1000px;
		padding: 5vw;
		box-sizing: border-box;
		min-height: 100vh;

		h2 {
			font-size: clamp(3rem, 12vw, 6rem);
			line-height: 0.8em;
			font-weight: 300;
			margin-bottom: 2rem;
			letter-spacing: -0.07em;
		}
	}

	/* --- Content Box Styling --- */
	.content-box {
		font-size: 1.2rem;
		line-height: 1.4em;
		font-weight: 500;
		box-sizing: border-box;
		color: var(--color-box-text);
		border: none; /* Remove border */
		padding: 2.5rem;
		background: var(--color-box-bg);
		// box-shadow: var(--box-shadow);
		// border-radius: var(--border-radius);
		/* width: 85%; */
		max-width: 700px;
		text-align: left; /* Align text left for readability */
		flex-shrink: 0;
		position: relative; /* For label positioning */
		overflow: hidden; /* Helps with some effects like reveal */

		/* General transition for properties affected by animations */
		transition:
			opacity 0.2s ease-out,
			transform 0.2s ease-out,
			background-color 0.2s ease-out,
			width 0.2s ease-out,
			clip-path 0.2s ease-out,
			stroke-dashoffset 0.1s linear;
		:global(.dark) & {
			--color-box-bg: #111;
		}
		h2,
		h3 {
			font-family: var(--font-heading);
			font-weight: 600;
			margin-top: 0;
			margin-bottom: 1rem;
			color: var(--duotone-primary);
		}

		p {
			margin-bottom: 1.5rem;
			// font-size: 1rem;
			color: var(--duotone-primary);

			&:last-child {
				margin-bottom: 0;
			}
			> code {
				background-color: color-mix(in srgb, var(--color-box-text) 15%, transparent);
				color: var(--color-box-text);
			}
		}

		img {
			max-width: 100%;
			height: auto;
			border-radius: var(--border-radius) / 2;
			margin-top: 1rem;
			display: block;
		}

		pre {
			background-color: var(--color-bg);
			padding: 1rem;
			border-radius: 4px;
			overflow-x: auto;
			color: var(--duotone-secondary);
			code {
				font-family: var(--font-code);
				font-size: 0.9rem;
			}
		}
	}

	.effect-label {
		// position: absolute;
		display: inline-flex;
		// top: -1px; /* Slight overlap */
		// right: -1px;
		margin-bottom: 2rem;
		// background-color: var(--color-accent);
		color: currentColor;
		// padding: 0.3rem 0.8rem;
		// font-size: 0.8rem;
		font-weight: 800;
		font-size: 1.5rem;
		border-radius: var(--border-radius); /* Top-right, bottom-left */
		font-family: var(--font-heading);
	}

	/* --- Animation Definitions --- */
	/* Note: Base state (opacity 0, initial transform) should be handled */
	/* by the animation logic itself when --scroll-progress is 0. */

	* :global(.animate-fade-slide) {
		--offset-y: 50px; /* Increased offset */
		opacity: calc(var(--scroll-progress)); /* Starts at 0 */
		/* Starts at translateY(50px) */
		transform: translateY(calc(var(--offset-y) * (1 - var(--scroll-progress))));
		will-change: opacity, transform;
	}

	* :global(.animate-fly-in-from-side) {
		transform: translateX(calc((50% + 50vw) * (1 - var(--scroll-progress))));
		will-change: transform;
	}

	* :global(.animate-scale) {
		opacity: calc(var(--scroll-progress));
		transform:
			/* Scale from 0.9 to 1.0 as progress goes 0 to 1 */ scale(
				calc(0.9 + 0.1 * var(--scroll-progress))
			)
			/* Translate from 20vh to 0vh as progress goes 0 to 1 */
			translateY(calc(20vh * (1 - var(--scroll-progress))));
		will-change: opacity, transform;
	}

	* :global(.animate-color) {
		opacity: 1; /* Make it always opaque for this effect */
		transform: scale(1); /* Ensure it's not scaled down initially */

		will-change: background-color;
		&:before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: tomato;
			z-index: 1;
			background-image: linear-gradient(
				45deg,
				white,
				var(--duotone-primary) calc((var(--scroll-progress) * 100) * 1%),
				white calc(80% * (var(--scroll-progress) * 10))
			);
			opacity: var(--scroll-progress);
			mix-blend-mode: difference;
		}

		// :global(h2),
		// :global(p) {
		// 	color: var(--color-text);
		// } /* Ensure text stays readable */
	}

	* :global(.animate-reveal) {
		opacity: 1; /* Keep content opaque */
		transform: scale(1); /* No scaling */
		clip-path: inset(-10% calc(110% - 120% * var(--scroll-progress)) -10% -20%);
		will-change: clip-path;
		// background-color: var(--color-primary); /* Light purple background */
	}

	* :global(.animate-width) {
		opacity: calc(var(--scroll-progress)); /* Starts at 0 */
		transform: scale(1); /* No scaling needed */
		/* Expand 20% -> 85% */ /* Starts at width: 20% */
		width: calc(100% * var(--scroll-progress));
		max-width: 700px; /* Keep max-width constraint */
		margin-left: auto; /* Keep centered */
		margin-right: auto;
		overflow: hidden; /* Hide overflowing content during expansion */
		will-change: width, opacity;
		:global(p) {
			white-space: nowrap;
		} /* Prevent text wrapping during animation */
	}

	* :global(.animate-svg) {
		opacity: 1;
		transform: scale(1);
		text-align: center; /* Center the SVG */

		:global(svg) {
			width: 100px;
			height: 100px;
			margin: 1rem auto;
			display: block;
			stroke: var(--color-primary);
			/* Calculate stroke-dasharray/offset based on path length */
			/* Assuming a square path length of 320 ( (90-10)*4 ) */
			--path-length: 320;
			stroke-dasharray: var(--path-length);
			/* Offset goes from path-length (fully hidden) down to 0 (fully drawn) */
			stroke-dashoffset: calc(var(--path-length) * (1 - var(--scroll-progress)));
			will-change: stroke-dashoffset;
		}
	}

	/* 7. Word Reveal (Staggered) */
	:global(.animate-word-reveal) {
		opacity: 1;
		transform: scale(1);
		line-height: 2;
		text-align: left;
		background-color: var(--color-bg);

		.word-block {
			display: inline-block;
			position: relative;
			margin-bottom: 0.2em;
			vertical-align: baseline;

			&::after {
				content: '';
				position: absolute;
				inset: -0.1em -0.05em -0.15em -0.05em;
				background-color: var(--color-box-bg);
				transform-origin: right;
				z-index: 1;
				border-radius: 2px;
				will-change: transform;
				transition: transform 0.1s ease-out; /* Keep for slight smoothing */

				/* --- Stagger Logic --- */
				--stagger-factor: 0.05; /* Adjust delay per word (lower = less delay) */

				/* Calculate progress for this specific word, delaying based on index */
				/* It clamps: stays 0 until scroll-progress passes the word's delay point */
				--delayed-progress: clamp(
					0,
					var(--scroll-progress) * 5 - (var(--word-index) * var(--stagger-factor)),
					1
				);

				/* Apply the transform using the word's specific delayed progress */
				transform: scaleX(calc(1 - var(--delayed-progress)));
			}
		}
	}
	:global(.confetti-container) {
		mix-blend-mode: plus-lighter;
	}
</style>
