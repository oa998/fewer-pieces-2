<script lang="ts">
  import { base } from "$app/paths";
  import Modal from "$components/modal.svelte";
  import {
    getStateManager,
    images,
    Intruders,
  } from "$lib/NemesisGameState.svelte";

  const mngr = getStateManager();
  let clicked = $state(false);

  type Props = {
    class?: string;
  };
  let { class: clazz }: Props = $props();

  const inBag = $derived<Record<string, number>>(
    mngr.gs.inBag.reduce(
      (acc, i) => {
        acc[i.name] = (acc[i.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const dead = $derived<Record<string, number>>(
    mngr.gs.dead.reduce(
      (acc, i) => {
        acc[i.name] = (acc[i.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const remaining = $derived<Record<string, number>>(
    mngr.gs.remainingTokens.reduce(
      (acc, i) => {
        acc[i.name] = (acc[i.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const displayOrder = [
    Intruders.BLANK,
    Intruders.LARVA,
    Intruders.CREEPER,
    Intruders.ADULT,
    Intruders.BREEDER,
    Intruders.QUEEN,
  ];

  function ordered<T>(map: Record<string, T>): [key: string, value: T][] {
    const matches = displayOrder.filter((name) => map[name]);
    return matches.map(
      (name) => Object.entries(map).find(([key]) => key == name)!
    );
  }
</script>

<button class={`text-white bg-black ${clazz}`} onclick={() => (clicked = true)}
  >View Bag - <span class="font-bold">{mngr.gs.inBag?.length || 0}</span
  ></button
>

<Modal
  isOpen={clicked}
  on:close={() => {
    clicked = false;
  }}
>
  <!-- #if clicked protects from hydration issues in dev mode -->
  {#if clicked}
    <div
      class="bg-black text-white p-4 text-3xl flex flex-row gap-6 border-red-950 border-[28px]"
      style="border-style:ridge;"
    >
      <div class="flex flex-col gap-2 min-w-[200px]">
        <div class="text-center">Bag</div>
        <div class="text-center text-sm text-yellow-200">
          Click to remove one
        </div>
        {#each ordered(inBag) as [name, count] (name)}
          <button
            onclick={() => mngr.putInRemainingFromBag(name)}
            class="flex flex-row gap-2 items-center border border-gray-800 rounded-xl p-6"
          >
            <div class="flex flex-col">
              <img
                src={`${base}/nemesis/${images[name]}`}
                alt={name}
                class="max-w-20"
              />
              <div class="text-xs text-center">{name}</div>
            </div>
            <div>x {count}</div>
          </button>
        {/each}
      </div>

      <div class="flex flex-col gap-2 bg-red-900 bg-opacity-40 min-w-[200px]">
        <div class="text-center">Dead</div>
        <div class="text-center text-sm">&nbsp;</div>
        {#each ordered(dead) as [name, count] (name)}
          <div
            class="flex flex-row gap-2 items-center border border-gray-800 rounded-xl p-6"
          >
            <div class="flex flex-col">
              <img
                src={`${base}/nemesis/${images[name]}`}
                alt={name}
                class="max-w-20"
              />
              <div class="text-xs text-center">{name}</div>
            </div>
            <div>x {count}</div>
          </div>
        {/each}
      </div>

      <div class="flex flex-col gap-2 bg-blue-950 bg-opacity-40 min-w-[200px]">
        <div class="text-center">Remaining</div>
        <div class="text-center text-sm text-yellow-200">
          Click to add one to bag
        </div>
        {#each ordered(remaining) as [name, count] (name)}
          <button
            onclick={() => mngr.putInBagFromRemaining(name)}
            class="flex flex-row gap-2 items-center border border-gray-800 rounded-xl p-6"
          >
            <div class="flex flex-col">
              <img
                src={`${base}/nemesis/${images[name]}`}
                alt={name}
                class="max-w-20"
              />
              <div class="text-xs text-center">{name}</div>
            </div>
            <div>x {count}</div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</Modal>
