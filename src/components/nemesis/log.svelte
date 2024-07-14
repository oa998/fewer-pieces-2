<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { getStateManager } from "$lib/NemesisGameState.svelte";

  const mngr = getStateManager();
  let clicked = $state(false);
  type Props = {
    class?: string;
  };
  let { class: clazz }: Props = $props();
</script>

<button class={`text-white bg-black ${clazz}`} onclick={() => (clicked = true)}
  >Show Log</button
>

<Modal
  isOpen={clicked}
  on:close={() => {
    clicked = false;
  }}
>
  <div
    class="bg-black p-20 text-white text-xl flex flex-col gap-14 max-h-[80lvh] overflow-y-scroll border-red-950 border-[28px]"
    style="border-style:ridge;"
  >
    {#each mngr.gs.log as log}
      <span class="text-mono">{log}</span>
    {/each}
  </div>
</Modal>

<style lang="postcss">
  span:before {
    content: "";
    margin-right: 2rem;
  }
</style>
