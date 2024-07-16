<script lang="ts">
  import {
    getStateManager,
    type Objective,
  } from "$lib/NemesisGameState.svelte";

  type Props = {
    objective: Objective;
  };
  const { objective }: Props = $props();
  let checked = $state(false);

  const mngr = getStateManager();
</script>

<label for={objective.options.join(",")}>
  <input type="checkbox" bind:checked id={objective.options.join(",")} hidden />
  <div
    class:opacity-20={checked}
    class:py-4={mngr.gs.objectives.length < 4}
    class="p-1 text-center border rounded text-white text-xs bg-slate-900 flex flex-col place-content-center h-full px-2"
  >
    {#each objective.options as o, i}
      <div>{o}</div>
      {#if i < objective.options.length - 1}
        <div class="flex flex-row items-center gap-3">
          <hr class="border flex-1" />
          <span>OR</span>
          <hr class="border flex-1" />
        </div>
      {/if}
    {/each}
  </div>
</label>
