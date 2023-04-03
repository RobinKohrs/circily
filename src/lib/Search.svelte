<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { onMount } from "svelte";
  import Fuse from "fuse.js";

  export let searchable;
  export let options;

  let searchbar;

  let fuse;
  $: if (searchbar && searchable && options) {
    fuse = new Fuse(searchable, options);
  }

  let textValue = "";
  let suggestions = [];

  // debounce the search
  let timeout = 200;

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  function handleKeyUp(event) {
    if (event.key === "Escape") {
      textValue = "";
      suggestions = [];
    }
  }

  function handleInput() {
    if (textValue.length > 0) {
      suggestions = fuse.search(textValue).slice(0, 3);
      console.log("suggestions: ", suggestions);
    } else {
      suggestions = [];
    }
  }

  let selected;
  function handleSuggestionClick(s) {
    selected = s;
    dispatch("select", s);
  }
</script>

<div class="search-container flex flex-col items-center gap-2">
  <input
    class="mx-auto block my-2"
    type="text"
    name=""
    id=""
    bind:this={searchbar}
    bind:value={textValue}
    on:keydown={handleKeyDown}
    on:keyup={handleKeyUp}
    on:input={handleInput}
  />

  {#if suggestions.length > 0}
    {#each suggestions as s}
      <div
        class="suggestion rounded-lg bg-slate-200 p-1 w-full text-center"
        on:click={() => handleSuggestionClick(s.item)}
      >
        {s.item.name}
      </div>
    {/each}
  {/if}
</div>

<style>
  input {
    padding: 0.5rem;
  }

  .suggestion {
    cursor: pointer;
  }
</style>
