<script>
  import { onMount } from "svelte";
  import Fuse from "fuse.js";

  export let searchable;
  export let options;

  let searchbar;

  //   let fuse;
  //   $: if (searchbar && searchable && options) {
  //     fuse = new Fuse(searchable, options);
  //   }

  let path = "https://storage.googleapis.com/gdatark/AT/AT10101.geojson";

  onMount(async () => {
    console.log("mounting");
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // cors allows us to make requests to other domains
        "Access-Control-Allow-Origin": "*",
      },
    });
    const data = await response.json();
    console.log("data", data);
  });
</script>
