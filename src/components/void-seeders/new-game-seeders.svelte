<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { getStateManager, type PlayerToken, TokenKeys } from "$lib/VoidSeedersGameState.svelte";

  const mngr = getStateManager();
  let clicked = $state(false);

  type Props = {
    class?: string;
  };
  let { class: clazz }: Props = $props();

  let scoutChecked = $state(false);
  let captainChecked = $state(false);
  let pilotChecked = $state(false);
  let soldierChecked = $state(false);
  let scientistChecked = $state(false);
  let mechanicChecked = $state(false);
  
  let convictChecked = $state(false);
  let bountyHunterChecked = $state(false);
  let ceoChecked = $state(false);
  let androidChecked = $state(false);
  let psychologistChecked = $state(false);
  let medicChecked = $state(false);
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
    class="bg-black p-10 text-white text-xl flex flex-col gap-10 border-red-950 border-[28px]"
    style="border-style:ridge;"
  >
    <div class="text-5xl font-bold text-center">New Game</div>
    <div class="text-center">Which Characters?</div>
    <div class="grid grid-cols-3 gap-5 w-full justify-around">
      <label
        for={`${TokenKeys.SCOUT}`}
        class:border-white={scoutChecked}
        class:border-gray-700={!scoutChecked}
        class:bg-black={!scoutChecked}
        class:bg-violet-900={scoutChecked}
        class:text-white={scoutChecked}
        class:font-bold={scoutChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Scout"}
        <input
          id={`${TokenKeys.SCOUT}`}
          type="checkbox"
          bind:checked={scoutChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.MEDIC}`}
        class:border-white={medicChecked}
        class:border-gray-700={!medicChecked}
        class:bg-black={!medicChecked}
        class:bg-pink-700={medicChecked}
        class:text-white={medicChecked}
        class:font-bold={medicChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Medic"}
        <input
          id={`${TokenKeys.MEDIC}`}
          type="checkbox"
          bind:checked={medicChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.PILOT}`}
        class:border-white={pilotChecked}
        class:border-gray-700={!pilotChecked}
        class:bg-black={!pilotChecked}
        class:bg-green-700={pilotChecked}
        class:text-white={pilotChecked}
        class:font-bold={pilotChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Pilot"}
        <input
          id={`${TokenKeys.PILOT}`}
          type="checkbox"
          bind:checked={pilotChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.ANDROID}`}
        class:border-white={androidChecked}
        class:border-gray-700={!androidChecked}
        class:bg-black={!androidChecked}
        class:bg-green-900={androidChecked}
        class:text-white={androidChecked}
        class:font-bold={androidChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Android"}
        <input
          id={`${TokenKeys.ANDROID}`}
          type="checkbox"
          bind:checked={androidChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.SOLDIER}`}
        class:border-white={soldierChecked}
        class:border-gray-700={!soldierChecked}
        class:bg-black={!soldierChecked}
        class:bg-red-700={soldierChecked}
        class:text-white={soldierChecked}
        class:font-bold={soldierChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Soldier"}
        <input
          id={`${TokenKeys.SOLDIER}`}
          type="checkbox"
          bind:checked={soldierChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.CONVICT}`}
        class:border-white={convictChecked}
        class:border-gray-700={!convictChecked}
        class:bg-black={!convictChecked}
        class:bg-red-900={convictChecked}
        class:text-white={convictChecked}
        class:font-bold={convictChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Convict"}
        <input
          id={`${TokenKeys.CONVICT}`}
          type="checkbox"
          bind:checked={convictChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.CAPTAIN}`}
        class:border-white={captainChecked}
        class:border-gray-700={!captainChecked}
        class:bg-black={!captainChecked}
        class:bg-blue-700={captainChecked}
        class:text-white={captainChecked}
        class:font-bold={captainChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Captain"}
        <input
          id={`${TokenKeys.CAPTAIN}`}
          type="checkbox"
          bind:checked={captainChecked}
          class="hidden"
        />
      </label>
      
      <label
        for={`${TokenKeys.CEO}`}
        class:border-white={ceoChecked}
        class:border-gray-700={!ceoChecked}
        class:bg-black={!ceoChecked}
        class:bg-blue-900={ceoChecked}
        class:text-white={ceoChecked}
        class:font-bold={ceoChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"CEO"}
        <input
          id={`${TokenKeys.CEO}`}
          type="checkbox"
          bind:checked={ceoChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.MECHANIC}`}
        class:border-white={mechanicChecked}
        class:border-gray-700={!mechanicChecked}
        class:bg-black={!mechanicChecked}
        class:bg-orange-600={mechanicChecked}
        class:text-white={mechanicChecked}
        class:font-bold={mechanicChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Mechanic"}
        <input
          id={`${TokenKeys.MECHANIC}`}
          type="checkbox"
          bind:checked={mechanicChecked}
          class="hidden"
        />
      </label>
      
      <label
        for={`${TokenKeys.BOUNTY_HUNGER}`}
        class:border-white={bountyHunterChecked}
        class:border-gray-700={!bountyHunterChecked}
        class:bg-black={!bountyHunterChecked}
        class:bg-orange-800={bountyHunterChecked}
        class:text-white={bountyHunterChecked}
        class:font-bold={bountyHunterChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Bounty Hunter"}
        <input
          id={`${TokenKeys.BOUNTY_HUNGER}`}
          type="checkbox"
          bind:checked={bountyHunterChecked}
          class="hidden"
        />
      </label>

      <label
        for={`${TokenKeys.SCIENTIST}`}
        class:border-white={scientistChecked}
        class:border-gray-700={!scientistChecked}
        class:bg-black={!scientistChecked}
        class:bg-stone-700={scientistChecked}
        class:text-white={scientistChecked}
        class:font-bold={scientistChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Scientist"}
        <input
          id={`${TokenKeys.SCIENTIST}`}
          type="checkbox"
          bind:checked={scientistChecked}
          class="hidden"
        />
      </label>
      
      <label
        for={`${TokenKeys.PSYCHOLOGIST}`}
        class:border-white={psychologistChecked}
        class:border-gray-700={!psychologistChecked}
        class:bg-black={!psychologistChecked}
        class:bg-gray-600={psychologistChecked}
        class:text-white={psychologistChecked}
        class:font-bold={psychologistChecked}
        class=" text-gray-300 p-4 text-center border-2 rounded-lg"
        >{"Psychologist"}
        <input
          id={`${TokenKeys.PSYCHOLOGIST}`}
          type="checkbox"
          bind:checked={psychologistChecked}
          class="hidden"
        />
      </label>
    </div>
    <button
      onclick={()=>{
        const players:PlayerToken[] = [];
        if(captainChecked) players.push(TokenKeys.CAPTAIN);
        if(soldierChecked) players.push(TokenKeys.SOLDIER);
        if(scientistChecked) players.push(TokenKeys.SCIENTIST);
        if(pilotChecked) players.push(TokenKeys.PILOT);
        if(scoutChecked) players.push(TokenKeys.SCOUT);
        if(mechanicChecked) players.push(TokenKeys.MECHANIC);
        
        if(bountyHunterChecked) players.push(TokenKeys.BOUNTY_HUNGER);
        if(ceoChecked) players.push(TokenKeys.CEO);
        if(convictChecked) players.push(TokenKeys.CONVICT);
        if(androidChecked) players.push(TokenKeys.ANDROID);
        if(psychologistChecked) players.push(TokenKeys.PSYCHOLOGIST);
        if(medicChecked) players.push(TokenKeys.MEDIC);
        mngr.newGame(players);
        clicked = false;
      }}
      disabled={[
        captainChecked,
        soldierChecked,
        scientistChecked,
        pilotChecked,
        scoutChecked,
        mechanicChecked,
        bountyHunterChecked,
        convictChecked,
        ceoChecked,
        androidChecked,
        psychologistChecked,
        medicChecked
      ].every((b) => !b)}
      class="w-full bg-slate-900 border-2 border-white disabled:border-gray-800 disabled:text-gray-700 rounded-lg py-1"
      >Submit</button
    >
  </div>
</Modal>
