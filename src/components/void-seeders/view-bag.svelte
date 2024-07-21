<script lang="ts">
  import { base } from "$app/paths";
  import Modal from "$components/modal.svelte";
  import {
    getStateManager,
    images,
    TokenKeys,
  } from "$lib/VoidSeedersGameState.svelte";
  import Icon from "@iconify/svelte";

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
    TokenKeys.BLANK,
    TokenKeys.SEEDER,
    TokenKeys.BLUE_PLAYER,
    TokenKeys.GREEN_PLAYER,
    TokenKeys.RED_PLAYER,
    TokenKeys.WHITE_PLAYER,
    TokenKeys.ORANGE_PLAYER,
    TokenKeys.PURPLE_PLAYER,
  ];

  function ordered<T>(map: Record<TokenKeys, T>): [key: TokenKeys, value: T][] {
    const matches = displayOrder.filter((name) => map[name]);
    return matches.map(
      (name) => Object.entries(map).find(([key]) => key == name)!
    ) as [];
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
              <div class="relative w-min">
                <img
                  src={`${base}/nemesis/${images[TokenKeys.BLANK]}`}
                  alt={name}
                  class="max-w-20"
                />
                {#if name == TokenKeys.SEEDER}
                  <span
                    class="rounded-full text-yellow-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-mono font-bold px-2"
                    >X</span
                  >
                {/if}
                {#if name.includes("PLAYER")}
                  <span
                    class:text-blue-600={name == TokenKeys.BLUE_PLAYER}
                    class:text-lime-500={name == TokenKeys.GREEN_PLAYER}
                    class:text-red-600={name == TokenKeys.RED_PLAYER}
                    class:text-white={name == TokenKeys.WHITE_PLAYER}
                    class:text-violet-700={name == TokenKeys.PURPLE_PLAYER}
                    class:orange-text={name == TokenKeys.ORANGE_PLAYER}
                  >
                    <Icon
                      icon="game-icons:astronaut-helmet"
                      class="rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-mono font-bold px-2 "
                    />
                  </span>
                {/if}
              </div>
              <div class="text-xs text-center">{name}</div>
            </div>
            <div>x {count}</div>
          </button>
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
              <div class="relative w-min">
                <img
                  src={`${base}/nemesis/${images[TokenKeys.BLANK]}`}
                  alt={name}
                  class="max-w-20"
                />
                {#if name == TokenKeys.SEEDER}
                  <span
                    class="rounded-full text-yellow-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-mono font-bold px-2"
                    >X</span
                  >
                {/if}
                {#if name.includes("PLAYER")}
                  <span
                    class:text-blue-600={name == TokenKeys.BLUE_PLAYER}
                    class:text-lime-500={name == TokenKeys.GREEN_PLAYER}
                    class:text-red-600={name == TokenKeys.RED_PLAYER}
                    class:text-white={name == TokenKeys.WHITE_PLAYER}
                    class:text-violet-700={name == TokenKeys.PURPLE_PLAYER}
                    class:orange-text={name == TokenKeys.ORANGE_PLAYER}
                  >
                    <Icon
                      icon="game-icons:astronaut-helmet"
                      class="rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-mono font-bold px-2 "
                    />
                  </span>
                {/if}
              </div>
              <div class="text-xs text-center">{name}</div>
            </div>
            <div>x {count}</div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</Modal>

<style lang="postcss">
  .orange-text {
    color: rgb(255, 141, 18);
  }
</style>
