<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { getStateManager, type PlayerToken, TokenKeys } from "$lib/VoidSeedersGameState.svelte";

  const mngr = getStateManager();
  let clicked = $state(false);

  type Props = {
    class?: string;
  };
  let { class: clazz }: Props = $props();

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
    class="bg-black p-20 text-white text-xl flex flex-col gap-10 border-red-950 border-[28px]"
    style="border-style:ridge;"
  >
    <div class="text-5xl font-bold text-center">New Game</div>
    <div class="text-center">Which Characters?</div>
    <div class="grid grid-cols-3 gap-5 w-full justify-around">
      <label
        for={`${TokenKeys.PURPLE_PLAYER}`}
        class:border-white={purpleChecked}
        class:border-gray-700={!purpleChecked}
        class:bg-black={!purpleChecked}
        class:bg-violet-900={purpleChecked}
        class:text-white={purpleChecked}
        class:font-bold={purpleChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Purple"}
        <input
          id={`${TokenKeys.PURPLE_PLAYER}`}
          type="checkbox"
          bind:checked={purpleChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.GREEN_PLAYER}`}
        class:border-white={greenChecked}
        class:border-gray-700={!greenChecked}
        class:bg-black={!greenChecked}
        class:bg-green-900={greenChecked}
        class:text-white={greenChecked}
        class:font-bold={greenChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Green"}
        <input
          id={`${TokenKeys.GREEN_PLAYER}`}
          type="checkbox"
          bind:checked={greenChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.RED_PLAYER}`}
        class:border-white={redChecked}
        class:border-gray-700={!redChecked}
        class:bg-black={!redChecked}
        class:bg-red-900={redChecked}
        class:text-white={redChecked}
        class:font-bold={redChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Red"}
        <input
          id={`${TokenKeys.RED_PLAYER}`}
          type="checkbox"
          bind:checked={redChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.BLUE_PLAYER}`}
        class:border-white={blueChecked}
        class:border-gray-700={!blueChecked}
        class:bg-black={!blueChecked}
        class:bg-blue-900={blueChecked}
        class:text-white={blueChecked}
        class:font-bold={blueChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Blue"}
        <input
          id={`${TokenKeys.BLUE_PLAYER}`}
          type="checkbox"
          bind:checked={blueChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.ORANGE_PLAYER}`}
        class:border-white={orangeChecked}
        class:border-gray-700={!orangeChecked}
        class:bg-black={!orangeChecked}
        class:bg-orange-800={orangeChecked}
        class:text-white={orangeChecked}
        class:font-bold={orangeChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Orange"}
        <input
          id={`${TokenKeys.ORANGE_PLAYER}`}
          type="checkbox"
          bind:checked={orangeChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.WHITE_PLAYER}`}
        class:border-white={whiteChecked}
        class:border-gray-700={!whiteChecked}
        class:bg-black={!whiteChecked}
        class:bg-gray-700={whiteChecked}
        class:text-white={whiteChecked}
        class:font-bold={whiteChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"White"}
        <input
          id={`${TokenKeys.WHITE_PLAYER}`}
          type="checkbox"
          bind:checked={whiteChecked}
          class="hidden"
        />
      </label>
    </div>
    <button
      onclick={()=>{
        const players:PlayerToken[] = [];
        if(blueChecked) players.push(TokenKeys.BLUE_PLAYER);
        if(redChecked) players.push(TokenKeys.RED_PLAYER);
        if(whiteChecked) players.push(TokenKeys.WHITE_PLAYER);
        if(greenChecked) players.push(TokenKeys.GREEN_PLAYER);
        if(purpleChecked) players.push(TokenKeys.PURPLE_PLAYER);
        if(orangeChecked) players.push(TokenKeys.ORANGE_PLAYER);
        mngr.newGame(players);
        clicked = false;
      }}
      disabled={[
        blueChecked,
        whiteChecked,
        greenChecked,
        redChecked,
        purpleChecked,
        orangeChecked,
      ].every((b) => !b)}
      class="w-full bg-slate-900 border-2 border-white disabled:border-gray-800 disabled:text-gray-700 rounded-lg py-1"
      >Submit</button
    >
  </div>
</Modal>
