<script lang="ts">
	const frameImages = [
		'frame1',
		'frame2',
		'frame3',
		'frame4',
		'frame5',
		'frame6',
		'frame7',
	];
	const fileExtension = 'png';
	export let forward:boolean;
	console.log(forward)
	let divEl;
	let iframe = 0;
	let increment = 1;
	if (!forward) {
		iframe = frameImages.length - 1;
		increment = -1
	}
	
	let intervalId = setInterval(() => {
			iframe += increment;
			if (iframe === frameImages.length || iframe < 0) {
				clearInterval(intervalId);
				intervalId = 0;
			}
		}, 80);
</script>
<svelte:head>
	// starts preloading images as soon as page is loaded
	{#each frameImages as img}
		<link rel="preload" as="image" href={`/img/flip-animation/${img}.${fileExtension}`} />
	{/each}
</svelte:head>

<div bind:this={divEl}>
  {#each frameImages as img, i}
		{#if iframe === i}
    	<img src={`/img/flip-animation/${frameImages[i]}.${fileExtension}`} alt={`animation image ${i}`} />
		{/if}
  {/each}
</div>

<style lang="scss">
  div {
    position:relative;
		height: 50em;
		border: 1px solid rgba(0,0,0,0.5);
		img {
			opacity: 0.5;
			// position: absolute;
			// top: 0;
			// left: 0;
			// bottom: 0;
			// right: 0;
		}
  }
</style>