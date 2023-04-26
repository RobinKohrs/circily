<script>
  import { onMount } from "svelte";

  import * as topojson from "topojson-client";
  import { csv } from "d3";
  import { geoPath, geoAlbers, geoMercator } from "d3-geo";
  import { draw } from "svelte/transition";

  // custom components
  import Search from "$lib/Search.svelte";
  import miniMap from "$lib/miniMap.svelte";
  import PromiseWrapper from "$lib/PromiseWrapper.svelte";

  // import data overview
  import countries from "../assets/data/countries.json";
  import MiniMap from "../lib/miniMap.svelte";

  // variables
  let selectedCountries = [];
  let selectedGemeinden = [];

  // function selectCountry(country) {
  //   if (country === "All") {
  //     if (selectedCountries.length === countries.length) {
  //       selectedCountries = [];
  //       return;
  //     } else {
  //       selectedCountries = countries.map((e) => e.country_id);
  //     }
  //   } else {
  //     if (selectedCountries.includes(country)) {
  //       selectedCountries = selectedCountries.filter((c) => c !== country);
  //       return;
  //     } else {
  //       selectedCountries = [...selectedCountries, country];
  //     }
  //   }
  // }

  async function loadCountries() {
    let countryIDs = countries.slice(1, 2).map((e) => e.country_id);
    // console.log("countries", countries);
    let promises = countryIDs.map(async (c) => {
      const raw = await fetch("/data/" + c + ".json");
      const json = await raw.json();
      return { [c]: json };
    });

    Promise.all(promises).then((values) => {
      selectedGemeinden = values.map((c) => Object.values(c)[0]).flat();
    });
  }

  onMount(() => {
    // selectCountry("AT");
    loadCountries();
  });

  let promise;
  async function queryData(gem) {
    let { gem_id, country_id } = gem;

    // build url
    let url = `https://raw.githubusercontent.com/RobinKohrs/geocrappy/main/data_raw/gemeinden/${country_id}/${gem_id}.geojson`;

    // fetch data
    let result;
    try {
      let raw_data = await fetch(url);
      let json = await raw_data.json();
      result = json;
    } catch (error) {
      currentJson = null;
      result = undefined;
    }

    // add delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    return result;
  }

  function handleSelect(e) {
    promise = queryData(e.detail);
  }

  let width, height;
</script>

<div class="container-app flex flex-col h-screen" bind:clientWidth={width}>
  <Search
    searchable={selectedGemeinden}
    options={{ keys: ["name"] }}
    on:select={handleSelect}
  />

  <div class="minimap-container grow text-white" bind:clientHeight={height}>
    {#if promise}
      {#await promise}
        loading
      {:then result}
        <MiniMap gemeinde={result} {width} {height} />
      {/await}
    {/if}
  </div>
</div>

<!-- <Search options={{ keys: ["gem_id"] }} /> -->
<style lang="scss">
  .container-app {
    max-width: 650px;
    margin: 0 auto;
    position: relative;
  }
</style>
