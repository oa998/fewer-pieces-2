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
    class="w-full grid place-items-center bg-gray-800 bg-opacity-50 py-10 rounded-xl gap-6 relative grid-cols-[min-content_1fr] landscape:grid-cols-[min-content_50vw] landscape:justify-center"
  >
    <div class="w-48 landscape:w-32">
      <div class="relative">
        <img
          src={`${base}/nemesis/${develop.src}`}
          alt={develop.name}
          class="rounded-full"
        />
        <span
          class="bg-yellow-300 rounded-full text-black absolute right-0 bottom-0 text-5xl font-mono px-2 border border-yellow-700"
          >{develop.threat}</span
        >
      </div>
    </div>
    <div class="text-white text-center px-20 text-lg">
      {DevelopmentRules[develop.name].message}
    </div>
    <button
      class="absolute top-2 right-2 rounded-xl bg-red-700 text-white text-xl p-2"
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
