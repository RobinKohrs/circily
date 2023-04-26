<script>
  export let promise;
</script>

<slot><!-- optional fallback --></slot>
{#if promise}
  <div class="promisewrapper text-white">
    {#await promise}
      <slot state="loading" name="loading" />
    {:then response}
      <slot {response} state="resolved" name="resolved" />
    {:catch error}
      <slot state="error" name="error" />
    {/await}
  </div>
{/if}
