<script lang="ts">
  import Modal from "$components/modal.svelte";
  import {
    getStateManager,
    type GameState,
  } from "$lib/NemesisGameState.svelte";

  const mngr = getStateManager();
  let clicked = $state(false);

  type Props = {
    class?: string;
  };
  let { class: clazz }: Props = $props();
  const players: GameState["players"][] = [1, 2, 3, 4, 5];
</script>

<button class={`text-white bg-black ${clazz}`} onclick={() => (clicked = true)}
  >New Game</button
>

<Modal
  isOpen={clicked}
  on:close={() => {
    clicked = false;
  }}
>
  <div
    class="bg-black p-20 text-white text-3xl flex flex-col gap-20 border-red-950 border-[28px]"
    style="border-style:ridge;"
  >
    <div class="text-5xl font-bold text-center">New Game</div>
    <div class="text-center">How many characters?</div>
    <div class="flex flex-row gap-10 w-full justify-around">
      {#each players as c}
        <button
          onclick={() => {
            mngr.newGame(c);
            clicked = false;
          }}
          class="border border-gray-500 p-4 aspect-square w-20">{c}</button
        >
      {/each}
    </div>
  </div>
</Modal>
