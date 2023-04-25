<script>
  import { geoMercator, geoPath, geoAlbers } from "d3-geo";
  import { draw } from "svelte/transition";
  export let width;
  export let height;
  export let gemeinde;
  $: console.log("gemeinde", gemeinde);
  $: console.log("width | height", width, " | ", height);

  // gemeinde.features = gemeinde.features;

  let projection;
  let path;
  let features = [];
  let show = false;

  $: if (gemeinde && width && height) {
    let gemeindeToFit = gemeinde.features.find(
      (f) => f.properties.type == "all"
    );
    projection = geoMercator().fitSize([width, height], gemeindeToFit);
    path = geoPath().projection(projection);

    gemeinde.features.forEach((f) => {
      features = [
        ...features,
        {
          type: "Feature",
          geometry: f.geometry,
          path: path(f),
          properties: {
            name: f.properties.comm_name,
            id: f.properties.id,
            type: f.properties.type,
          },
        },
      ];
    });
    show = true;
  }
</script>

<div class="result w-full h-full">
  {#if gemeinde && path && projection}
    <svg {width} {height} viewBox="0 0  {width} {height}">
      <g>
        {#each features as feature}
          {#if feature.properties.type == "gem"}
            {#if show}
              <path
                in:draw={{ delay: 1000, duration: 1000 }}
                out:draw={{ duration: 500 }}
                d={feature.path}
                stroke="white"
                fill="transparent"
                stroke-width="2"
              />
            {/if}
          {/if}
        {/each}
      </g>
    </svg>
  {/if}
</div>

<!-- <div class="result w-full h-full">
  {#if features.length > 0 && path && projection}
    <svg {width} {height} viewBox="0 0  {width} {height}">
      <g>
        {#each features as feature}
          {#if feature.properties.type == "circle"}
            <path
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
</div> -->

<style lang="scss">
</style>
