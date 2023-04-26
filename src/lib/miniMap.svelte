<script>
  import { geoMercator, geoPath, geoAlbers } from "d3-geo";
  import { draw } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";
  import { feature } from "topojson-client";
  export let width;
  export let height;
  export let gemeinde;

  let projection;
  let path;
  let features = [];
  let show = false;

  async function getFeature(gemeinde) {
    features = gemeinde.features.map((f) => {
      let newF = {
        type: "Feature",
        geometry: f.geometry,
        path: path(f),
        properties: {
          name: f.properties.comm_name,
          id: f.properties.id,
          type: f.properties.type,
        },
      };

      return newF;
    });

    show = true;
  }

  $: if (gemeinde) {
    let gemeindeToFit = gemeinde.features.find(
      (f) => f.properties.type == "all"
    );

    projection = geoMercator().fitSize([width, height], gemeindeToFit);
    path = geoPath().projection(projection);

    getFeature(gemeinde);
  }
</script>

<div class="svg-container">
  {#if gemeinde && path && projection}
    <svg {width} {height} viewBox="0 0  {width} {height}">
      <g>
        {#each features as feature, i}
          {#if feature.properties.type == "gem"}
            <path
              in:draw={{ delay: 2, duration: 1000 }}
              d={feature.path}
              stroke="white"
              fill="transparent"
              stroke-width="2"
            />
          {/if}
        {/each}
      </g>
    </svg>
  {/if}
</div>

<style lang="scss">
</style>
