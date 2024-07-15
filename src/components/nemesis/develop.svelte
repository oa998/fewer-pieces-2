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
    class="w-full grid place-items-center bg-gray-800 bg-opacity-50 py-10 rounded-xl gap-6 relative max-h-[40vh]"
  >
    <div class="max-w-48 landscape:max-w-32">
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
      class="absolute top-2 right-2 rounded-xl bg-red-700 text-white text-3xl p-2"
      onclick={() => mngr.developEnd()}>Ｘ</button
    >
  </div>
{/if}
