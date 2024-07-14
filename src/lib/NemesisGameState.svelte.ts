import { browser } from "$app/environment";
import { getContext, setContext } from "svelte";

const version = 33;

export type IntruderToken = {
  name: string;
  threat: number;
  damage: number;
  src: string;
  id: string;
  rotation: number;
};

export type GameState = {
  players: 1 | 2 | 3 | 4 | 5;
  inBag: IntruderToken[];
  inPlay: (IntruderToken & {
    color: "transparent" | "blue" | "green" | "orange";
  })[];
  developing: IntruderToken[];
  encounter: IntruderToken[];
  remainingTokens: IntruderToken[];
  dead: IntruderToken[];
  log: string[];
  logsOpen: boolean;
  startNewGame: boolean;
  version: number;
};

export const Intruders = {
  QUEEN: "QUEEN",
  BREEDER: "BREEDER",
  ADULT: "ADULT",
  CREEPER: "CREEPER",
  LARVA: "LARVA",
  BLANK: "BLANK",
};

export const images = {
  [Intruders.QUEEN]: "QueenOfficial.webp",
  [Intruders.BREEDER]: "BreederOfficial.webp",
  [Intruders.ADULT]: "AdultOfficial.webp",
  [Intruders.CREEPER]: "CreeperOfficial.webp",
  [Intruders.LARVA]: "LarvaOfficial.webp",
  [Intruders.BLANK]: "BlankOfficial.webp",
};

const totalTokens = {
  [Intruders.LARVA]: [
    {
      threat: 1,
      tokens: 8,
    },
  ],
  [Intruders.CREEPER]: [
    {
      threat: 1,
      tokens: 3,
    },
  ],
  [Intruders.ADULT]: [
    {
      threat: 2,
      tokens: 4,
    },
    {
      threat: 3,
      tokens: 5,
    },
    {
      threat: 4,
      tokens: 3,
    },
  ],
  [Intruders.BREEDER]: [
    {
      threat: 3,
      tokens: 1,
    },
    {
      threat: 4,
      tokens: 1,
    },
  ],
  [Intruders.QUEEN]: [
    {
      threat: 4,
      tokens: 1,
    },
  ],
};

const totalCountPerIntruder = Object.entries(totalTokens).reduce(
  (acc, [k, v]) => {
    for (const tt of v) {
      acc[k] = (acc[k] || 0) + tt.tokens;
    }
    return acc;
  },
  {} as { [key: string]: number }
);

function resetAllIntruders() {
  const ALL_INTRUDERS: IntruderToken[] = [];
  let key: keyof typeof Intruders;
  for (key in Intruders) {
    const name = Intruders[key];
    if (name === Intruders.BLANK) {
      ALL_INTRUDERS.push({
        name,
        threat: 0,
        damage: 0,
        src: images[name],
        id: `${name}_0`,
        rotation: 50,
      });
      continue;
    }
    let x = 0;
    for (const j in totalTokens[name]) {
      if (+j === 0) x = 0; // reset the outermost counter for every new totken type
      const tt = totalTokens[name][j];
      for (let i = 0; i < tt.tokens; i++) {
        x++;
        ALL_INTRUDERS.push({
          name,
          threat: tt.threat,
          damage: 0,
          src: images[name],
          id: `${name}_${j}${i}`,
          rotation: x * (360 / totalCountPerIntruder[name]),
        });
      }
    }
  }
  return ALL_INTRUDERS;
}

Array.prototype.popRandom = function popRandom() {
  if (this.length === 0) return null;
  const index = Math.floor(Math.random() * this.length);
  const element = this[index];
  this.splice(index, 1);
  return element;
};

export function putRandomIntruderIntoBag(state: GameState, name: string) {
  const options = state.remainingTokens.filter((i) => i.name === name);
  if (options.length > 0) {
    const o = options?.popRandom() as IntruderToken;
    o.damage = 0;
    const index = state.remainingTokens.findIndex(
      (intruder) => intruder?.id === o.id
    );
    state.remainingTokens.splice(index, 1); // remove this one
    state.inBag.push(o);
  }
  return state;
}

export function putRandomIntruderIntoRemaining(state: GameState, name: string) {
  const options = state.inBag.filter((i) => i.name === name);
  if (options.length > 0) {
    const o = options?.popRandom() as IntruderToken;
    const index = state.inBag.findIndex((intruder) => intruder?.id === o.id);
    state.inBag.splice(index, 1); // remove this one
    state.remainingTokens.push(o);
  }
  return state;
}

export const newGame = (players: GameState["players"] = 3) => {
  const allIntruders = resetAllIntruders();
  const startingCounts = {
    [Intruders.BLANK]: 1,
    [Intruders.LARVA]: 4,
    [Intruders.CREEPER]: 1,
    [Intruders.ADULT]: 3 + players,
    [Intruders.BREEDER]: 0,
    [Intruders.QUEEN]: 1,
  };

  const newState: GameState = {
    players,
    inBag: [],
    inPlay: [],
    developing: [],
    encounter: [],
    remainingTokens: allIntruders,
    dead: [],
    log: [],
    logsOpen: false,
    startNewGame: true,
    version,
  };

  for (const intruder of Object.keys(startingCounts)) {
    for (let i = 0; i < startingCounts[intruder]; i++) {
      putRandomIntruderIntoBag(newState, intruder);
    }
  }

  return newState;
};

type DevelopmentAction = (state: GameState) => GameState;
export const DevelopmentRules: {
  [key: string]: { message: string; action: DevelopmentAction };
} = {
  [Intruders.BLANK]: {
    message:
      "Add 1 Adult token to the Intruder bag. Return this token to the bag.",
    action: (state) => {
      const updated = putRandomIntruderIntoBag(state, Intruders.ADULT);
      const blank = updated.developing.pop() as IntruderToken; // should be the blank token
      updated.inBag.push(blank);
      return state;
    },
  },
  [Intruders.LARVA]: {
    message:
      "Remove this token from the Intruder bag and add 1 Adult token to the Intruder bag.",
    action: (state) => {
      const updated = putRandomIntruderIntoBag(state, Intruders.ADULT);
      const larva = updated.developing.pop() as IntruderToken; // should be the larva token
      updated.remainingTokens.push(larva);
      return updated;
    },
  },
  [Intruders.CREEPER]: {
    message:
      "Remove this token from the Intruder bag and add 1 Breeder token to the Intruder bag.",
    action: (state) => {
      const updated = putRandomIntruderIntoBag(state, Intruders.BREEDER);
      const creeper = updated.developing.pop() as IntruderToken; // should be the creeper token
      updated.remainingTokens.push(creeper);
      return updated;
    },
  },
  [Intruders.ADULT]: {
    message: `All players roll for Noise in order. If a player's Character is in Combat with an Intruder, this player does not perform a Noise roll. Return the Adult Intruder token to the Intruder bag.`,
    action: (state) => {
      const updated = state;
      const adult = updated.developing.pop() as IntruderToken; // should be the adult token
      updated.inBag.push(adult);
      return state;
    },
  },
  [Intruders.BREEDER]: {
    message: `All players roll for Noise in order. If a player's Character is in Combat with an Intruder, this player does not perform a Noise roll. Return the Breeder Intruder token to the Intruder bag.`,
    action: (state) => {
      const updated = state;
      const breeder = updated.developing.pop() as IntruderToken; // should be the breeder token
      updated.inBag.push(breeder);
      return updated;
    },
  },
  [Intruders.QUEEN]: {
    message: `Queen - If there are any Characters in the Nest Room, place the Queen miniature in that Room and resolve an Encounter. If there are no Characters in the Nest (or its location has not been discovered yet), add an additional Egg token on the Intruder board. Return the Queen Intruder token to the Intruder bag.`,
    action: (state) => {
      const updated = state;
      const queen = updated.developing.pop() as IntruderToken; // should be the queen token
      updated.inBag.push(queen);
      return updated;
    },
  },
};

export const EncounterMessages = {
  [Intruders.BLANK]: {
    message:
      "Add 1 Adult token to the Intruder bag. Return this token to the bag.",
  },
};

function storeLocalNemesis() {
  return function (
    target: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod: (...args: any[]) => unknown = descriptor.value; // eslint-disable-line @typescript-eslint/no-explicit-any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (this: StateManager, ...args: any[]) {
      originalMethod.apply(this, args);
      if (browser)
        localStorage.setItem("nemesis_game", JSON.stringify(this.gs));
    };

    return descriptor;
  };
}

class StateManager {
  #gameState = $state<GameState>(newGame(4));

  constructor() {
    if (browser && localStorage?.getItem("nemesis_game")) {
      const previous = JSON.parse(
        localStorage.getItem("nemesis_game") as string
      ) as GameState;
      this.#gameState = previous;
    }
  }

  get gs() {
    return this.#gameState;
  }

  get version() {
    return this.#gameState?.version;
  }

  @storeLocalNemesis()
  v() {
    this.#gameState.startNewGame = !this.#gameState?.startNewGame;
    this.#gameState.version = Math.floor(Math.random() * 9e9);
  }

  @storeLocalNemesis()
  develop() {
    if (this.#gameState.inBag.length === 0) return;
    if (this.#gameState.developing.length > 0) return;
    const intruder = this.#gameState.inBag.popRandom() as IntruderToken;
    this.#gameState.developing.push(intruder);
  }

  @storeLocalNemesis()
  developEnd() {
    if (this.#gameState.developing.length === 0) return;
    const { message, action } =
      DevelopmentRules[this.#gameState.developing[0].name];
    this.captureLog(
      `Development: Drew ${this.#gameState.developing[0].name}. ${message}`
    );
    return action(this.#gameState); // COME BACK TO THIS
  }

  @storeLocalNemesis()
  encounter() {
    if (this.#gameState.inBag.length === 0) return;
    // Should never be able to pop a null token here - should always have at least a blank token in bag
    const intruder = JSON.parse(
      JSON.stringify(this.#gameState.inBag.popRandom() as IntruderToken)
    );
    this.#gameState.encounter = [intruder]; // Always save over encounter. Only one at a time.
  }

  @storeLocalNemesis()
  encounterDone() {
    if (this.#gameState.encounter.length === 0) return;
    const lastEncounter = this.#gameState.encounter.pop() as IntruderToken;
    this.#gameState.encounter = [];
    // return the blank to the bag else put the Intruder into play
    if (lastEncounter.name === Intruders.BLANK) {
      this.#gameState.inBag.push(lastEncounter);
      const inBagCount = this.#gameState.inBag.length;
      putRandomIntruderIntoBag(this.#gameState, Intruders.ADULT);
      if (this.#gameState.inBag.length == inBagCount) {
        // adult was not added
        this.captureLog(
          `Encounter: Drew a blank. No adults remain to add to the bag.`
        );
      } else {
        this.captureLog(
          `Encounter: Drew a blank. ${Intruders.ADULT} added to bag.`
        );
      }
    } else {
      this.#gameState.inPlay.push({ ...lastEncounter, color: "transparent" });
      this.captureLog(
        `Encounter: ${lastEncounter.name} put into play. Sneak attack value: ${lastEncounter.threat}.`
      );
    }
  }

  @storeLocalNemesis()
  kill(tokenId: string) {
    if (this.#gameState.inPlay.length === 0) return;
    const index = this.#gameState.inPlay.findIndex((i) => i.id === tokenId);
    if (index < 0) return;
    const intruder = this.#gameState.inPlay[index];
    this.#gameState.inPlay.splice(index, 1);
    this.#gameState.dead.push(intruder);
    this.captureLog(`Killed ${intruder.name}.`);
  }

  @storeLocalNemesis()
  setColor(tokenId: string, color: GameState["inPlay"][number]["color"]) {
    if (this.#gameState.inPlay.length === 0) return;
    const index = this.#gameState.inPlay.findIndex((i) => i.id === tokenId);
    if (index < 0) return;
    if (this.#gameState.inPlay[index].color === color) return; // do nothing if no change
    this.#gameState.inPlay[index].color = color;
    this.captureLog(
      `Set color on ${this.#gameState.inPlay[index].name} to "${
        this.#gameState.inPlay[index].color
      }".`
    );
  }

  @storeLocalNemesis()
  setDamage(tokenId: string, damage: number) {
    if (this.#gameState.inPlay.length === 0) return;
    const index = this.#gameState.inPlay.findIndex((i) => i.id === tokenId);
    if (index < 0) return;
    const startDamage = this.#gameState.inPlay[index].damage;
    if (damage === startDamage) return; // do nothing if no change
    this.#gameState.inPlay[index].damage = damage;
    this.captureLog(
      `Damage on ${
        this.#gameState.inPlay[index].name
      } changed from ${startDamage} to ${this.#gameState.inPlay[index].damage}.`
    );
  }

  @storeLocalNemesis()
  returnToBag(tokenId: string) {
    if (this.#gameState.inPlay.length === 0) return;
    const index = this.#gameState.inPlay.findIndex((i) => i.id === tokenId);
    if (index < 0) return;
    const intruder = this.#gameState.inPlay[index];
    this.captureLog(`Returned ${intruder.name} to bag.`);
    intruder.damage = 0;
    this.#gameState.inPlay.splice(index, 1);
    this.#gameState.inBag.push(intruder);
  }

  @storeLocalNemesis()
  putInBagFromRemaining(name: IntruderToken["name"]) {
    if (this.#gameState.remainingTokens.length === 0) return;
    const index = this.#gameState.remainingTokens.findIndex(
      (i) => i.name === name
    );
    if (index < 0) return;
    const newState = putRandomIntruderIntoBag(this.#gameState, name);
    this.captureLog(`Added ${name} to bag from remaining.`);
    this.#gameState = newState;
  }

  @storeLocalNemesis()
  putInRemainingFromBag(name: IntruderToken["name"]) {
    if (name == Intruders.BLANK) return;
    if (this.#gameState.inBag.length === 0) return;
    const index = this.#gameState.inBag.findIndex((i) => i.name === name);
    if (index < 0) return;
    const newState = putRandomIntruderIntoRemaining(this.#gameState, name);
    this.captureLog(`Added ${name} to remaining from bag.`);
    this.#gameState = newState;
  }

  @storeLocalNemesis()
  toggleNewGamePrompt() {
    this.#gameState.startNewGame = !this.#gameState.startNewGame;
  }

  @storeLocalNemesis()
  newGame(players: GameState["players"]) {
    const gs = newGame(players);
    this.#gameState.startNewGame = false;
    this.#gameState = gs;
    this.captureLog(`New game with ${players} players.`);
  }

  @storeLocalNemesis()
  toggleLogs() {
    this.#gameState.logsOpen = !this.#gameState.logsOpen;
  }

  // not store local. Used in other mechanics methods
  captureLog(message: string) {
    this.#gameState.log.push(message);
  }
}

// Only interact with the game state via context.
const STATE_KEY = Symbol("GAME_STATE_KEY");

export function setStateManager() {
  return setContext(STATE_KEY, new StateManager());
}

export function getStateManager() {
  return getContext<ReturnType<typeof setStateManager>>(STATE_KEY);
}
