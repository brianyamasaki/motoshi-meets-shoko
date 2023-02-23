<script lang="ts">
	import type { WeekInfo } from './includes.js';

	export let weeks: WeekInfo[];


	const cweeks = 7;
	// constants for percentages within the image where the days are located
	const xImgHalf = 52;
	const yDivs = [
		40,
		68
	];

	let iweek = 0;
	let transcription = '';
	const nextWeek = () => {
		iweek = Math.min(iweek + 1, cweeks - 1);
	}

	const prevWeek = () => {
		iweek = Math.max(0, iweek - 1);
	}
	
	const handleKeypress = (event: KeyboardEvent) => {
		console.log(event.key);
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
				return;
			}
			transcription = '';
		}

	}
</script>

<div class="container">
	<div id="buttonBar">
		<button on:click={prevWeek} disabled={iweek === 0? true : false}>
			Previous Week
		</button>
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
						const iday = idayClicked(xPct, yPct) + (iweek * 7) + 83;
						findEntry(iday);
					}} 
					on:keypress={handleKeypress} 
				/>
			</li>
			{:else }
				<li></li>
			{/if}
		{/each}
	</ul>
	<p>{transcription}</p>
</div>

<style>
	#buttonBar {
		display:flex;
		justify-content: space-between;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		display:block;
		position:relative;
		background: url('/img/leather-pad.jpg') right bottom no-repeat;
		text-align: center;
		height: auto;
	}
	img {
		max-width: 100%;
	}
	
</style>