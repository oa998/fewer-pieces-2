<script lang="ts">
  import { base } from "$app/paths";
  import {
    DevelopmentRules,
    getStateManager,
  } from "$lib/NemesisGameState.svelte";

  const mngr = getStateManager();
  $: develop = mngr.gs.developing?.[0];
</script>

{#if develop}
  <div
    class="w-full grid place-items-center bg-gray-800 bg-opacity-50 py-10 rounded-xl gap-6 relative h-min"
  >
    <div class="grid grid-cols-[1fr_5fr] gap-6 px-6">
      <div class="relative w-[10vh] max-w-[10vh] place-self-center">
        <img
          src={`${base}/nemesis/${develop.src}`}
          alt={develop.name}
          class="rounded-full"
        />
        <span
          class="bg-yellow-300 rounded-full text-black absolute right-0 bottom-0 text-xl font-mono px-2 border border-yellow-700"
          >{develop.threat}</span
        >
      </div>
      <div class="text-white text-center text-sm self-end">
        {DevelopmentRules[develop.name].message}
      </div>
    </div>
    <button
      class="absolute top-2 right-2 rounded bg-red-700 text-white text-xl aspect-square w-8 grid place-items-center"
      onclick={() => mngr.developEnd()}>Ｘ</button
    >
  </div>
{/if}

<style lang="postcss">
  .grid-cols-sizing {
    grid-template-columns: min-content 1fr;
    background-color: orange;
  }
</style>
