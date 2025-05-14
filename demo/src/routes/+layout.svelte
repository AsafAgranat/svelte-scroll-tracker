<script lang="ts">
	import type { Snippet } from 'svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectSpeedInsights();

	let { children }: { children?: Snippet } = $props();
</script>

{@render children?.()}
