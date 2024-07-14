<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let dialogRef: HTMLDialogElement;
  export let isOpen = false;
  export const open = () => dialogRef.showModal();
  export const close = () => dialogRef.close();
  export let closeDisabled = false;
  let clazz: string = "";
  export { clazz as class };

  let cleanup: () => void = () => {};
  onMount(() => {
    function onclick(e) {
      if (closeDisabled) return;
      const dialogDimensions = dialogRef.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialogRef.close();
      }
    }

    dialogRef.addEventListener("click", onclick);
    cleanup = function () {
      dialogRef.removeEventListener("click", onclick);
    };
  });

  $: if (dialogRef) {
    if (isOpen && !dialogRef.open) {
      dialogRef.showModal();
    } else {
      dialogRef.close();
    }
  }

  onDestroy(() => {
    cleanup();
  });
</script>

<dialog open={isOpen} class={`mt-1/2 ${clazz}`} bind:this={dialogRef} on:close>
  <div class={`p-5`}>
    <slot />
  </div>
</dialog>

<style lang="postcss">
  dialog {
    z-index: 10;
    background: transparent;
    border: none;
  }
  dialog::backdrop {
    @apply bg-gray-400 bg-opacity-50 absolute;
  }
</style>
