<script>
  import { onMount } from "svelte";

  import * as topojson from "topojson-client";
  import { csv } from "d3";
  import { geoPath, geoAlbers, geoMercator } from "d3-geo";
  import { draw } from "svelte/transition";

  // custom components
  import Search from "$lib/Search.svelte";
  import miniMap from "$lib/miniMap.svelte";

  // import data overview
  import countries from "../assets/data/countries.json";
  import MiniMap from "../lib/miniMap.svelte";

  // variables
  let selectedCountries = [];
  let selectedGemeinden = [];
  function selectCountry(country) {
    if (country === "All") {
      if (selectedCountries.length === countries.length) {
        selectedCountries = [];
        return;
      } else {
        selectedCountries = countries.map((e) => e.country_id);
      }
    } else {
      if (selectedCountries.includes(country)) {
        selectedCountries = selectedCountries.filter((c) => c !== country);
        return;
      } else {
        selectedCountries = [...selectedCountries, country];
      }
    }
  }

  async function loadCountries() {
    let promises = selectedCountries.map(async (c) => {
      const raw = await fetch("/data/" + c + ".json");
      const json = await raw.json();
      return { [c]: json };
    });

    Promise.all(promises).then((values) => {
      selectedGemeinden = values.map((c) => Object.values(c)[0]).flat();
    });
  }

  $: if (selectedCountries) {
    loadCountries();
  }

  onMount(() => {
    selectCountry("AT");
  });

  let currentJson;
  $: console.log("currentJson: ", currentJson);
  async function queryData(gem) {
    let { gem_id, country_id } = gem;

    // build url
    let url = `https://raw.githubusercontent.com/RobinKohrs/geocrappy/main/data_raw/gemeinden/${country_id}/${gem_id}.geojson`;

    // fetch data
    try {
      let raw_data = await fetch(url);
      let json = await raw_data.json();
      currentJson = json;
    } catch (error) {
      currentJson = null;
    }
  }

  function handleSelect(e) {
    queryData(e.detail);
  }
</script>

<div class="container-app">
  <div class="container-countries flex gap-3 justify-center flex-wrap">
    <button
      class="p-2 rounded-md mr-auto bg-slate-400"
      on:click={() => selectCountry("All")}
    >
      {#if selectedCountries.length === countries.length}
        None
      {:else}
        All
      {/if}
    </button>
    {#each countries as c, i}
      <button
        style:background-color={selectedCountries.includes(c.country_id)
          ? "var(--btn-color)"
          : "var(--btn-color-select)"}
        class="p-2 rounded-md"
        on:click={() => selectCountry(c.country_id)}
      >
        {c.country_id}
      </button>
    {/each}
  </div>

  <Search
    searchable={selectedGemeinden}
    options={{ keys: ["name"] }}
    on:select={handleSelect}
  />

  {#if currentJson}
    <MiniMap />
  {/if}
</div>

<!-- <Search options={{ keys: ["gem_id"] }} /> -->
<style lang="scss">
  .container-app {
    height: 100%;
    max-width: 650px;
    margin: 0 auto;
    position: relative;
  }
</style>
