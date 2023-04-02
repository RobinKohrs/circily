<script>
  import { onMount } from "svelte";
  import Fuse from "fuse.js";

  export let searchable;
  export let options;

  let searchbar;

  let fuse;
  $: if (searchbar && searchable && options) {
    fuse = new Fuse(searchable, options);
  }
</script>

<input type="text" name="" id="" />
