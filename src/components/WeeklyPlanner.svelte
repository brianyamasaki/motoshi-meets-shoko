<script lang="ts">
	import { onMount } from 'svelte';
	import type { WeekInfo, PhotoInfo } from './includes.js';
	import { cdayFirstMonday }	from './includes';
	import SvelteMarkdown from 'svelte-markdown'

	export let weeks: WeekInfo[];

	const paramString = 'week';
	const cweeks = 7;
	// constants for percentages within the image where the days are located
	const xImgHalf = 52;
	const yDivs = [
		40,
		68
	];
	const frameImages = [
		'frame1.png',
		'frame2.png',
		'frame3.png',
		'frame4.png',
		'frame5.png',
		'frame6.png',
		'frame7.png',
	];

	const getUrlWeekParams = (): number => {
		const SearchParams = new URLSearchParams(window.location.search);
		const value = SearchParams.get(paramString);
		return value ? parseInt(value, 10) : 0;
	}

	const setUrlWeekParams = (i: number) => {
		const loc = document.location;
		const newUrl = `${loc.protocol}//${loc.host}/?${paramString}=${i.toString()}`
		const state = {path: newUrl};
		history.pushState(state, '', newUrl);
	}

	let iweek = 0;
	let transcription = '';
	let entryImage = '';
	let relatedPhotos: PhotoInfo[] = [];
	let showModal = false;
	let touchList: TouchList = [];
	onMount ( () => {

		iweek = getUrlWeekParams();

	});
	
	const nextWeek = () => {
		iweek = Math.min(iweek + 1, cweeks - 1);
		setUrlWeekParams(iweek);
		showModal = false;
	}

	const prevWeek = () => {
		iweek = Math.max(0, iweek - 1);
		setUrlWeekParams(iweek);
		showModal = false;
	}
	
	const handleKeypress = (event: KeyboardEvent) => {
		console.log(event.key);
	}

	const startTouch = (event: TouchEvent) => {
		touchList = event.touches;
	}

	const endTouch = (event: TouchEvent) => {
		if (touchList.length > 0) {
			const dx = touchList[0].clientX - event.touches[0].clientX;
			const dy = touchList[0].clientY - event.touches[0].clientY;
			if (Math.abs(dy) < Math.abs(dx)) {
				if (dx > 0) {
					nextWeek();
				} else {
					prevWeek();
				}
			}
		}
	}
	let imgEl: HTMLElement;

	const iyClicked = (yPct: number): number => {
		if (yPct < yDivs[0]) {
			return 0;
		} else if (yPct < yDivs[1]) {
			return 1;
		}
		return 2;
	}

	const idayClicked = (xPct: number, yPct: number) : number => {
		const iy = iyClicked(yPct);
		if (xPct < xImgHalf) {
			return iy;
		} else {
			if (iy < 2) {
				return iy + 3;
			} else {
				if (xPct < 72) {
					return iy + 3;
				}
				return iy + 4;
			}
		}
	}

	const findEntry = (iday: number) => {
		if (weeks && weeks[iweek]) {
			const entries = weeks[iweek].entries;
			const entry = entries.find((entryT) => (entryT.dayOfYear === iday));
			if (entry) {
				transcription = entry.text;
				entryImage = `/img/days/${entry.textImg}`;
				relatedPhotos = entry.relatedPhotos;
				return;
			}
			transcription = '';
			entryImage = '';
			relatedPhotos = [];
		}

	}
</script>

<svelte:head>
	// starts preloading images as soon as page is loaded
  {#each weeks as week}
    <link rel="preload" as="image" href={week.strWeekImg} />
  {/each}
	{#each frameImages as img}
		<link rel="preload" as="image" href={`/img/flip-animation/${img}`} />
	{/each}
</svelte:head>

<div class="container" on:touchstart={startTouch} on:touchend={endTouch}>
	<div id="buttonBar">
		<button on:click={prevWeek} disabled={iweek === 0? true : false}>
			Previous Week
		</button>
		<span>Click or Tap on date for enlargement</span>
		<button on:click={nextWeek} disabled={iweek === cweeks - 1 ? true : false}>
			Next Week
		</button>	
	</div>
	<ul>
		{#each weeks as week, i}
			{#if iweek === i}
			<li>
				<img bind:this={imgEl}
					src={week.strWeekImg} 
					alt={week.strImageAlt}
					on:click={(event) => {
						const xPct = (event.offsetX / imgEl.clientWidth) * 100;
						const yPct = (event.offsetY / imgEl.clientHeight) * 100;
						const iday = idayClicked(xPct, yPct) + (iweek * 7) + cdayFirstMonday;
						findEntry(iday);
						if (transcription) showModal = true;
					}} 
					on:keypress={handleKeypress} 
				/>
			</li>
			{:else }
				<li></li>
			{/if}
		{/each}
	</ul>
	{#if showModal }
	<div id="modal" on:click={() => (showModal = !showModal)}>
		<div>
			<img src={`${entryImage}`} alt="Motoshi's original handwriting">
		</div>
		<div>
			<SvelteMarkdown source={transcription} />
			{#if relatedPhotos }
				<div>
					{#each relatedPhotos as photoSrc}
						<div>
							<img src={photoSrc.imgSrc} alt={photoSrc.label} />
							<p>{photoSrc.label}</p>
						</div>
					{/each}
				</div>
			{/if}
			<small>Click or Tap to dismiss</small>
		</div>
	</div>
	{/if}
</div>

<style>
	.container {
		position:relative;
		padding:calc(1vw + 1vh + .3vmin);
	}
	#buttonBar {
		display:flex;
		justify-content: space-between;
	}

	#buttonBar span {
		display:block;
		text-align: center;
	}
	button {
		padding: 8px;
		border-radius: 4px;
		color: white;
		background: rgb(85, 59, 32);
	}
	button:disabled {
		background: rgb(146, 124, 77);
		cursor:not-allowed;
	}

	ul {
		list-style: none;
		padding: 0;
		margin:.25em 0;
	}
	li {
		display:block;
		position:relative;
		box-shadow: 5px 4px 4px black;
		background: url('/img/leather-pad.jpg') right bottom repeat-y;
		background-size:cover;
		text-align: center;
		height: auto;
	}
	img {
		max-width: 100%;
	}
	#modal {
		font-family: Literata, Georgia, 'Times New Roman', Times, serif;
		z-index: 10;
		position: absolute;
		top: 2.5em;
		left: 0;
		bottom: auto;
		right: 0;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 1em;
		padding: 1em;
		text-align: center;
	}

	#modal img {
		max-height: 25em;
	}

	#modal :global(h2) {
		font-size: 2.5em;
	}

	#modal :global(p) {
		text-align: center;
		font-size: 1.5em;
		padding: 1em;
		margin: 0 auto;
		max-width: 60rem;
	}
	#modal small {
		margin-top: 2em;
		display: block;
		text-align: center;
	}
</style>