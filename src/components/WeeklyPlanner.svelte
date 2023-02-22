<script lang="ts">
	import type weekInfo from './Planner.astro';

	export let weeks: weekInfo[];

	const cweeks = 7;
	let iweek = 0;
	const nextWeek = () => {
		iweek = Math.min(iweek + 1, cweeks - 1);
	}

	const prevWeek = () => {
		iweek = Math.max(0, iweek - 1);
	}
	
	const handleClick = (event) : void => {
		alert(`${event.clientX}, ${event.clientY}`);
	}
	const handleKeypress = (event) => {

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
			<li on:click={handleClick} on:keypress={handleKeypress}>
				<img class="{iweek === i ? "visible": ""}" src={week.strWeekImg} alt={week.strWeekAlt} />
			</li>
		{/each}
	</ul>
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
	}
	img {
		display:none;
	}
	img.visible {
		display:block;
	}
	img {
		max-width: 100%;
	}
	
</style>