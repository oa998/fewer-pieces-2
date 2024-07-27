<script lang="ts">
  import { base } from "$app/paths";
  import {
    DevelopmentRules,
    getStateManager,
    TokenKeys,
  } from "$lib/VoidSeedersGameState.svelte";
  import Icon from "@iconify/svelte";

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
        {#if develop.name == TokenKeys.SEEDER}
          <span
            class="rounded-full text-yellow-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-mono font-bold px-2"
            >{develop.threat}</span
          >
        {/if}
        {#if !develop.name.includes("SEEDER") && !develop.name.includes("BLANK")}
          <span
            class:text-blue-600={[TokenKeys.CAPTAIN, TokenKeys.CEO].includes(
              develop.name
            )}
            class:text-lime-500={[TokenKeys.PILOT, TokenKeys.ANDROID].includes(
              develop.name
            )}
            class:text-red-600={[TokenKeys.SOLDIER, TokenKeys.CONVICT].includes(
              develop.name
            )}
            class:text-white={[
              TokenKeys.SCIENTIST,
              TokenKeys.PSYCHOLOGIST,
            ].includes(develop.name)}
            class:text-violet-700={develop.name == TokenKeys.SCOUT}
            class:text-pink-400={develop.name == TokenKeys.MEDIC}
            class:orange-text={[
              TokenKeys.MECHANIC,
              TokenKeys.BOUNTY_HUNGER,
            ].includes(develop.name)}
          >
            <Icon
              icon="game-icons:astronaut-helmet"
              class="rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-mono font-bold px-2 "
            />
          </span>
        {/if}
      </div>
      <div class="text-white text-center text-sm self-end">
        {@html DevelopmentRules[develop.name]?.message}
      </div>
    </div>
    <button
      class="absolute top-2 right-2 rounded bg-red-700 text-white text-xl aspect-square w-8 grid place-items-center"
      onclick={() => mngr.developEnd()}>Ｘ</button
    >
  </div>
{/if}

<style lang="postcss">
  .orange-text {
    color: rgb(255, 141, 18);
  }
</style>
