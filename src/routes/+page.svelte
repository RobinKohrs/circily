<script>
  import { onMount } from "svelte";

  import * as topojson from "topojson-client";
  import { csv } from "d3";
  import { geoPath, geoAlbers, geoMercator } from "d3-geo";
  import { draw } from "svelte/transition";

  import Search from "$lib/Search.svelte";
</script>

<Search options={{ keys: ["gem_id"] }} />

<style lang="scss">
  .content-container {
    margin: 0 5%;
    height: 100%;
    display: grid;
    align-items: center;

    & .gemeinde-container {
      width: 400px;
      height: 400px;
      border: 1px solid black;
    }
  }
</style>
