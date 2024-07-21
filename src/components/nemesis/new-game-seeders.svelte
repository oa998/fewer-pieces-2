<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { getStateManager } from "$lib/NemesisGameState.svelte";
  import { TokenKeys } from "$lib/VoidSeedersGameState.svelte";

  const mngr = getStateManager();
  let clicked = $state(false);

  type Props = {
    class?: string;
  };
  let { class: clazz }: Props = $props();

  // TokenKeys.PURPLE_PLAYER,
  // TokenKeys.BLUE_PLAYER,
  // TokenKeys.GREEN_PLAYER,
  // TokenKeys.RED_PLAYER,
  // TokenKeys.WHITE_PLAYER,
  // TokenKeys.ORANGE_PLAYER,

  let purpleChecked = $state(false);
  let blueChecked = $state(false);
  let greenChecked = $state(false);
  let redChecked = $state(false);
  let whiteChecked = $state(false);
  let orangeChecked = $state(false);
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
    <div class="text-center">Which Characters?</div>
    <div class="flex flex-row gap-10 w-full justify-around">
      <div
        class:bg-green-800={purpleChecked}
        class:text-white={purpleChecked}
        class="bg-green-200 text-black"
      >
        <label for={`${TokenKeys.PURPLE_PLAYER}`}
          >{"Purple"}
          <input
            id={`${TokenKeys.PURPLE_PLAYER}`}
            type="checkbox"
            bind:checked={purpleChecked}
            class="hidden"
          />
        </label>
      </div>
    </div>
  </div>
</Modal>
