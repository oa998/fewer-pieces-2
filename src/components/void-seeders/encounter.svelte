<script lang="ts">
  import { base } from "$app/paths";
  import {
    EncounterMessages,
    TokenKeys,
    type GameState,
  } from "$lib/VoidSeedersGameState.svelte";
  import Icon from "@iconify/svelte";

  export let encounter: GameState["encounter"][number];
</script>

<div
  class="p-10 bg-black text-white max-w-md border-red-950 border-[28px]"
  style="border-style:ridge;"
>
  {#if encounter}
    <div class="relative flex justify-center">
      <img
        src={`${base}/nemesis/${encounter.src}`}
        alt={encounter.name}
        class="max-w-[200px]"
      />
      {#if encounter.name == TokenKeys.SEEDER}
        <span
          class="rounded-full text-yellow-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-mono font-bold px-2"
          >{encounter.threat}</span
        >
      {/if}
      {#if encounter.name.includes("PLAYER")}
        <span
          class:text-blue-600={encounter.name == TokenKeys.BLUE_PLAYER}
          class:text-lime-500={encounter.name == TokenKeys.GREEN_PLAYER}
          class:text-red-600={encounter.name == TokenKeys.RED_PLAYER}
          class:text-white={encounter.name == TokenKeys.WHITE_PLAYER}
          class:text-violet-700={encounter.name == TokenKeys.PURPLE_PLAYER}
          class:orange-text={encounter.name == TokenKeys.ORANGE_PLAYER}
        >
          <Icon
            icon="game-icons:astronaut-helmet"
            class="rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-mono font-bold px-2 "
          />
        </span>
      {/if}
    </div>
    <div class="text-yellow-200 text-2xl text-center my-3 font-bold">
      {encounter.name}
    </div>
    {#if EncounterMessages[encounter.name]}
      {@html EncounterMessages[encounter.name].message}
    {/if}
  {/if}
</div>
