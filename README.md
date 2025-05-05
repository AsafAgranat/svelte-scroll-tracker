

# svelte-scroll-tracker


A lightweight, dependency-free, and performant Svelte 5 component for tracking scroll progress of an element within the viewport.

This component is intentionally barebones: it generates only a single CSS progress variable (`--scroll-progress`), making it extremely flexible and easy to apply to any CSS animation, effect, or logic you want. You have full control over how to use the progress value in your styles or scripts.

## Why is it performant?

- Uses a single IntersectionObserver to detect when the element enters or leaves the viewport, minimizing unnecessary work.
- Throttles scroll event handling using `requestAnimationFrame`, ensuring updates are efficient and do not overload the browser during rapid scrolling.
- Only updates the CSS variable when the element is in view, reducing unnecessary DOM writes.
- No external dependencies or heavy libraries—just native browser APIs and Svelte reactivity.

## Install

```sh
npm install svelte-scroll-tracker
```

## Usage

```svelte
<script lang="ts">
  import ScrollTracker from 'svelte-scroll-tracker';
</script>

<ScrollTracker
  startThreshold={0}
  endThreshold={0.5}
  debug={false}
>
  <div style="height: 400px;">
    Scroll me!
    <div>Progress: {Math.round(100 * $css('--scroll-progress'))}%</div>
  </div>
</ScrollTracker>
```

- The component sets a CSS custom property `--scroll-progress` (from 0 to 1) on its root element as you scroll.
- You can customize `startThreshold`, `endThreshold`, and `debug` via props.
- No external dependencies; works out of the box with Svelte 5.

## Props

| Prop            | Type    | Default | Description                                      |
|-----------------|---------|---------|--------------------------------------------------|
| startThreshold  | number  | 0       | When to start mapping progress (0-1)             |
| endThreshold    | number  | 0.5     | When to end mapping progress (0-1)               |
| debug           | boolean | false   | Enable debug logging                             |
