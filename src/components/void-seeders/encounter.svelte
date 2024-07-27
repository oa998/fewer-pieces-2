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
      {#if !encounter.name.includes("SEEDER") && !encounter.name.includes("BLANK")}
        <span
          class:text-blue-600={[TokenKeys.CAPTAIN, TokenKeys.CEO].includes(
            encounter.name
          )}
          class:text-lime-500={[TokenKeys.PILOT, TokenKeys.ANDROID].includes(
            encounter.name
          )}
          class:text-red-600={[TokenKeys.SOLDIER, TokenKeys.CONVICT].includes(
            encounter.name
          )}
          class:text-white={[
            TokenKeys.SCIENTIST,
            TokenKeys.PSYCHOLOGIST,
          ].includes(encounter.name)}
          class:text-violet-700={encounter.name == TokenKeys.SCOUT}
          class:text-pink-400={encounter.name == TokenKeys.MEDIC}
          class:orange-text={[
            TokenKeys.MECHANIC,
            TokenKeys.BOUNTY_HUNGER,
          ].includes(encounter.name)}
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

<style lang="postcss">
  .orange-text {
    color: rgb(255, 141, 18);
  }
</style>
