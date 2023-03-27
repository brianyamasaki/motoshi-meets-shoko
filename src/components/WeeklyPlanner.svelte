<script lang="ts">
	import { onMount } from 'svelte';
	import type { WeekInfo, PhotoInfo } from './includes.js';
	import { cdayFirstMonday }	from './includes';
	import SvelteMarkdown from 'svelte-markdown'

	export let weeks: WeekInfo[];
	const weekImgAspect = 1200 / 852;

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
	let iweekNext = 0;
	let transcription = '';
	let entryImage = '';
	let relatedPhotos: PhotoInfo[] = [];
	let showModal = false;
	const frameInterval = 80;
	const flipAnimationTime = frameInterval * frameImages.length;
	let touchList: TouchList = [];
	enum mdAnimation {
		stopAnim = 0,
		nextAnim,
		prevAnim
	};
	let showFlipAnimation = mdAnimation.stopAnim;
	let iframe = 0;

	// gets called when the browser "back" button gets pressed
	const popStateListener = () => {
		iweek = getUrlWeekParams();
	}

	onMount ( () => {

		iweek = getUrlWeekParams();
		window.addEventListener('popstate', popStateListener)

		return () => {
			window.removeEventListener('popstate', popStateListener);
		}
	});

	const doFlipAnimation = (animType: mdAnimation) => {
		showFlipAnimation = animType;
		let increment: number;
		if (animType === mdAnimation.nextAnim) {
			iframe = 0;
			increment = 1;
		} else {
			iframe = frameImages.length - 1;
			increment = -1;
		}

		const interval = setInterval(() => {
			iframe += increment;
			if (iframe < 0 || iframe === frameImages.length) {
				clearInterval(interval);
				iweek = iweekNext;
			}
		}, frameInterval);
	}
	
	const nextWeek = () => {
		iweekNext = Math.min(iweek + 1, cweeks - 1);
		setUrlWeekParams(iweek);
		showModal = false;
		doFlipAnimation(mdAnimation.nextAnim);
	}

	const prevWeek = () => {
		iweekNext = Math.max(0, iweek - 1);
		setUrlWeekParams(iweek);
		showModal = false;
		doFlipAnimation(mdAnimation.prevAnim);
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

<div>
	<div class="instructions">
		Click or Tap on date for enlargement
	</div>
	<div class="deskpad">
		<div class="container" on:touchstart={startTouch} on:touchend={endTouch}>
				{#each weeks as week, i}
					{#if iweek === i}
						<img 
							class="week-image"
							bind:this={imgEl}
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
					{/if}
				{/each}
				{#if showFlipAnimation !== mdAnimation.stopAnim}
					{#each frameImages as img, i}
						{#if iframe === i}
							<img 
								class="flip-animation" 
								src={`/img/flip-animation/${frameImages[i]}`} 
								alt={`animation image ${i}`} 
								style="clientLeft: {imgEl.clientLeft} clientTop: {imgEl.clientTop} clientHeight: {imgEl.clientHeight * 0.8} clientBottom: {imgEl.clientWidth}"
							/>
						{/if}
				{/each}
				{/if}
			<button class="previous" on:click={prevWeek} disabled={iweek === 0? true : false}/>
			<button class="next" on:click={nextWeek}  disabled={iweek === cweeks - 1 ? true : false}/>
			{#if showModal }
			<div id="modal" on:click={() => (showModal = !showModal)} on:keydown={() => (showModal = !showModal)}>
				<div>
					<img class="handwriting" src={`${entryImage}`} alt="Motoshi's original handwriting">
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
	</div>
</div>

<style>
	.deskpad {
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 5px 4px 4px black;
		background: url('/img/leather-pad.jpg') right bottom repeat-y;
		background-size:cover;
		text-align: center;
	}
	.container {
		position:relative;
		width: clamp(45ch, 85%, 150ch);
		height: 90%;
		margin: 2em;
	}
	
	.instructions {
		display:block;
		text-align: center;
		color: white; 
	}
	img.week-image {
		width: 100%;
	}
	img.flip-animation {
		max-width: 100%;
		position:absolute;
		top: -6vw;
		left:0;
		right:0;
	}
	button {
		background: rgba(255, 255, 255, 0.4) center center no-repeat;
		background-size: contain;
		border: none;
		border-radius:4px;
		position: absolute;
		bottom: 50%;
		width: calc(4vw + 25px);
		height: calc(4vw + 33px);
	}
	button:hover {
		background-color: rgba(255, 255, 255, 0.6);
	}
	button:active {
		background-color: rgba(255, 150, 150, 0.4);
	}
	button.previous {
		background-image: url('/img/prev.png');
		left: 0;
	}
	button.next {
		background-image: url('/img/next.png');
		right: 0;
	}
	button.next:disabled,
	button.previous:disabled {
		background:none;
		background-image:none;
	}
	#modal {
		font-family: Literata, Georgia, 'Times New Roman', Times, serif;
		z-index: 10;
		position: absolute;
		top: 0;
		left: 0;
		bottom: auto;
		right: 0;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 1em;
		padding: 2em;
		text-align: center;
	}

	#modal img {
		max-height: 25em;
		max-width: 100%;
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