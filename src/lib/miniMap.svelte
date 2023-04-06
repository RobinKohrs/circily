<script>
  import { geoMercator, geoPath } from "d3-geo";
  export let width;
  export let height;
  export let gemeinde;

  gemeinde.features = gemeinde.features;

  let projection;
  let path;
  let features = [];

  $: {
    if (gemeinde && width && height) {
      projection = geoMercator().fitSize([width, height], gemeinde);
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
    }
  }
</script>

<div class="result w-full h-full">
  {#if features.length > 0 && path && projection}
    <svg {width} {height} viewBox="0 0  {width} {height}">
      <g>
        {#each features as feature}
          {#if feature.properties.type == "circle"}
            {console.log(feature.path) || ""}
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
</div>

<style lang="scss">
</style>
