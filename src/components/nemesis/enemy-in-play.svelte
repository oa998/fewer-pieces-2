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
  class="max-w-[10vw] portrait:max-w-[15vw]"
  onclick={() => (clicked = true)}
>
  {#if enemy}
    <div class="relative">
      <img
        src={`${base}/nemesis/${enemy.src}`}
        alt={enemy.name}
        class="rounded-full aspect-square"
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
    class="flex flex-col gap-3 bg-black text-white text-xl py-6 items-center rounded-xl w-full px-20 border-red-950 border-[28px]"
    style="border-style:ridge;"
  >
    <div class="flex flex-row gap-24">
      <div class="relative">
        <img
          src={`${base}/nemesis/${enemy.src}`}
          alt={enemy.name}
          class="rounded-full max-w-[15vw]"
          style={`box-shadow: 0 0 35px ${enemy.color}, 0 0 20px ${enemy.color};`}
        />
        <span
          class="bg-red-800 rounded-full text-white absolute right-0 bottom-0 text-3xl font-mono py-2 px-4 border border-red-500"
          >{enemy.damage}</span
        >
      </div>
      <div class="flex flex-col items-center">
        <div class="flex flex-row gap-10 items-center">
          <button
            class="border p-3 rounded-xl aspect-square w-16 text-5xl font-bold leading-8"
            onclick={() => mngr.setDamage(enemy.id, enemy.damage - 1)}>-</button
          >
          <div>Damage</div>
          <button
            class="border p-3 rounded-xl aspect-square w-16 text-5xl font-bold leading-8"
            onclick={() => mngr.setDamage(enemy.id, enemy.damage + 1)}>+</button
          >
        </div>
        <hr class="w-full border-gray-400 my-6" />

        <div>Color Highlight:</div>
        <div class="grid grid-cols-4 place-items-center gap-8">
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
      </div>
    </div>
    <hr class="w-full border-gray-400 my-6" />
    <button
      class="w-full rounded-xl border-2 border-blue-800 bg-slate-900 text-3xl p-4"
      onclick={() => {
        mngr.returnToBag(enemy.id);
        clicked = false; // close
      }}
    >
      <div class="">Return to Bag</div>
    </button>

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
