<script lang="ts">
  import { base } from "$app/paths";
  import {
    EncounterMessages,
    Intruders,
    type GameState,
  } from "$lib/NemesisGameState.svelte";

  export let encounter: GameState["encounter"][number];
</script>

<div
  class="p-10 bg-black text-white max-w-xs border-red-950 border-[28px]"
  style="border-style:ridge;"
>
  {#if encounter}
    <div class="relative">
      <img src={`${base}/nemesis/${encounter.src}`} alt={encounter.name} />
      <span
        class="bg-yellow-200 rounded-full text-black absolute right-0 bottom-0 aspect-square w-20 text-5xl grid place-items-center font-mono"
        >{encounter.threat}</span
      >
    </div>
    <div class="text-yellow-200 text-2xl text-center my-3 font-bold">
      {encounter.name}
    </div>
    {#if encounter.name == Intruders.BLANK}
      <div class="italic text-center">
        {EncounterMessages[encounter.name].message}
      </div>
    {/if}
  {/if}
</div>
