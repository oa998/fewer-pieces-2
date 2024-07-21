<script lang="ts">
  import { base } from "$app/paths";
  import Modal from "$components/modal.svelte";
  import Develop from "$components/void-seeders/develop.svelte";
  import Encounter from "$components/void-seeders/encounter.svelte";
  import EnemyInPlay from "$components/void-seeders/enemy-in-play.svelte";
  import Log from "$components/void-seeders/log.svelte";

  import NewGameSeeders from "$components/void-seeders/new-game-seeders.svelte";
  import Objective from "$components/void-seeders/objective.svelte";
  import ViewBag from "$components/void-seeders/view-bag.svelte";
  import { setStateManager } from "$lib/VoidSeedersGameState.svelte";
  const mngr = setStateManager();
</script>

<div
  class="bg-svg h-[100lvh] w-full overflow-y-scroll landscape:grid landscape:grid-cols-2"
>
  <div class="relative">
    <div class="relative">
      <img
        src={`${base}/nemesis/void_title.jpg`}
        alt="nemesis"
        class={`w-full object-cover max-h-[30lvh] landscape:max-h-[40lvh] landscape:w-full landscape:h-auto`}
      />
      <div
        class="text-center font-extralight text-5xl landscape:text-4xl text-slate-500 w-full absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        V O I D S E E D E R S
      </div>
    </div>
    <a
      href={`${base}/nemesis`}
      class="bg-black-900 text-pink-300 border-pink-300 border py-1 px-3 rounded text-xs absolute left-2 top-2"
      >Base Game</a
    >
    <div class="flex flex-col gap-2 absolute top-2 right-2">
      <NewGameSeeders
        class="bg-black-900 text-pink-300 border-pink-300 border py-1 px-3 rounded text-xs"
      />
      <ViewBag
        class="bg-black-900 text-white border-gray-500 border py-1 px-3 rounded text-xs"
      />
      <Log
        class="bg-black-900 text-white border-gray-500 border py-1 px-3 rounded text-xs"
      />
    </div>
    <div class="w-full p-5 gap-10 flex flex-row">
      <button
        disabled={mngr.gs.developing.length > 0}
        class="border p-2 w-full text-center rounded-xl text-2xl bg-blue-900 bg-opacity-50 text-yellow-500 border-yellow-500 disabled:brightness-50"
        on:click={() => {
          mngr.develop();
        }}>Develop</button
      >
      <button
        class="border p-2 w-full text-center rounded-xl text-2xl bg-red-900 bg-opacity-50 text-yellow-500 border-yellow-500"
        on:click={() => {
          mngr.encounter();
        }}>Encounter</button
      >
    </div>
  </div>

  {#if mngr.gs.developing.length}
    <div class="p-4">
      <Develop />
    </div>
  {/if}

  <Modal
    isOpen={mngr.gs.encounter.length > 0}
    on:close={() => mngr.encounterDone()}
  >
    <Encounter encounter={mngr.gs.encounter[0]} />
  </Modal>

  <div class="fixed bottom-0 left-0 w-full flex flex-col gap-4">
    <span class="text-white w-full border-b border-gray-400 pl-12 bold-font"
      >Objectives</span
    >
    <div
      class="w-full flex flex-row overflow-y-scroll px-8 gap-8 justify-center"
    >
      {#each mngr.gs.objectives as o}
        <Objective objective={o} />
      {/each}
    </div>

    <div
      class:py-4={mngr.gs.inPlay.length > 0}
      class="w-full flex flex-row overflow-y-scroll px-8 gap-8 bg-red-500 bg-opacity-20"
    >
      {#each mngr.gs.inPlay as intruder}
        <EnemyInPlay enemy={intruder} />
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .bg-svg {
    background-color: #000000;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(275,640,444)'%3E%3Cstop offset='0' stop-color='%23000000'/%3E%3Cstop offset='1' stop-color='%23000000'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='300' height='250' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.06'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E");
    background-attachment: fixed;
    background-size: cover;
  }
  * {
    font-family: "Turret Road", sans-serif;
    font-weight: 300;
    font-style: normal;
  }

  .bold-font {
    font-family: "Turret Road", sans-serif;
    font-weight: 700;
  }
</style>
