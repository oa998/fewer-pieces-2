<script lang="ts">
  import { base } from "$app/paths";
  import Modal from "$components/modal.svelte";
  import {
    type GameState,
    getStateManager,
  } from "$lib/NemesisGameState.svelte";

  type Props = {
    enemy: GameState["inPlay"][number];
  };

  let { enemy }: Props = $props();
  let clicked = $state(false);
  const mngr = getStateManager();
</script>

<button
  class="p-4 rounded-3xl w-[15vh] max-h-[40px]"
  onclick={() => (clicked = true)}
>
  {#if enemy}
    <div class="relative">
      <img
        src={`${base}/nemesis/${enemy.src}`}
        alt={enemy.name}
        class="rounded-full"
        style={`box-shadow: 0 0 35px ${enemy.color}, 0 0 20px ${enemy.color};`}
      />
      <span
        class="bg-red-800 rounded-full text-white absolute right-0 bottom-0 text-2xl font-mono px-2 border border-red-500"
        >{enemy.damage}</span
      >
    </div>
  {/if}
</button>

<Modal
  isOpen={clicked}
  on:close={() => {
    clicked = false;
  }}
>
  <div
    class="flex flex-col gap-3 bg-black text-white text-3xl py-6 items-center rounded-2xl px-32"
  >
    <div class="relative">
      <img
        src={`${base}/nemesis/${enemy.src}`}
        alt={enemy.name}
        class="rounded-full max-w-[200px]"
        style={`box-shadow: 0 0 35px ${enemy.color}, 0 0 20px ${enemy.color};`}
      />
      <span
        class="bg-red-800 rounded-full text-white absolute right-0 bottom-0 text-5xl font-mono py-2 px-4 border border-red-500"
        >{enemy.damage}</span
      >
    </div>
    <div>Damage up/down:</div>
    <div class="flex flex-row gap-10">
      <button
        class="border p-3 rounded-xl aspect-square w-16"
        onclick={() => mngr.setDamage(enemy.id, enemy.damage - 1)}>-</button
      >
      <button
        class="border p-3 rounded-xl aspect-square w-16"
        onclick={() => mngr.setDamage(enemy.id, enemy.damage + 1)}>+</button
      >
    </div>

    <div>Color Highlight:</div>
    <div class="grid grid-cols-4 place-items-center gap-2">
      {#each ["transparent", "rgb(0, 100, 240)", "lime", "crimson"] as c}
        <button
          class:border-4={c == enemy.color}
          class:border={c !== enemy.color}
          class:c-selected={c == enemy.color}
          class:c-not-selected={c !== enemy.color}
          class={`c-btn`}
          style={`background-color: ${c};`}
          onclick={() => mngr.setColor(enemy.id, c)}
        ></button>
      {/each}
    </div>
    <hr class="w-full border-gray-400 my-6" />
    <button
      class="w-full rounded-xl border-2 border-red-800 bg-slate-900 text-3xl p-4"
      onclick={() => {
        mngr.kill(enemy.id);
        clicked = false; // close
      }}
    >
      <div class="">Kill</div>
      <div class="text-sm italic text-red-200">remove from game</div>
    </button>
  </div>
</Modal>

<style lang="postcss">
  .c-selected {
    @apply w-14 h-14;
  }
  .c-not-selected {
    @apply w-10 h-10;
  }
  .c-btn {
    @apply rounded border-white;
  }
</style>
