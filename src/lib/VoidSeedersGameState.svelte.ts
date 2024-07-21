import { browser } from "$app/environment";
import { base } from "$app/paths";
import { getContext, setContext } from "svelte";
import { objectives, type Objective } from "./NemesisGameState.svelte";

export enum TokenKeys {
  BLANK = "BLANK",
  SEEDER = "SEEDER",
  BLUE_PLAYER = "BLUE_PLAYER",
  ORANGE_PLAYER = "ORANGE_PLAYER",
  WHITE_PLAYER = "WHITE_PLAYER",
  PURPLE_PLAYER = "PURPLE_PLAYER",
  GREEN_PLAYER = "GREEN_PLAYER",
  RED_PLAYER = "RED_PLAYER",
}

export type SeederTokens = {
  name: TokenKeys;
  threat: number;
  damage: number;
  src: string;
  id: string;
  rotation: number;
};

export type GameState = {
  inBag: SeederTokens[];
  inPlay: (SeederTokens & {
    color: "transparent" | "blue" | "green" | "orange";
    image: string;
  })[];
  developing: SeederTokens[];
  encounter: SeederTokens[];
  remainingTokens: SeederTokens[];
  log: string[];
  objectives: Objective[];
  logsOpen: boolean;
  startNewGame: boolean;
  kills: number;
};

export const Seeders = {
  DESPOILER: "DESPOILER",
  STALKER: "STALKER",
  WHISPERER: "WHISPERER",
  LURKER: "LURKER",
  LAIR: "LAIR",
  BLANK: "BLANK",
};

export const images = {
  [Seeders.DESPOILER]: "QueenOfficial.webp",
  [Seeders.STALKER]: "BreederOfficial.webp",
  [Seeders.WHISPERER]: "AdultOfficial.webp",
  [Seeders.LURKER]: "CreeperOfficial.webp",
  [Seeders.BLANK]: "BlankOfficial.webp",
};

// const TokenKeys = {
//   BLANK: "BLANK",
//   SEEDER: "SEEDER",
//   BLUE_PLAYER: "BLUE_PLAYER",
//   ORANGE_PLAYER: "ORANGE_PLAYER",
//   WHITE_PLAYER: "WHITE_PLAYER",
//   PURPLE_PLAYER: "PURPLE_PLAYER",
//   GREEN_PLAYER: "GREEN_PLAYER",
//   RED_PLAYER: "RED_PLAYER",
// }

export const BagTokens = {};

const totalTokens = {
  [TokenKeys.SEEDER]: [
    {
      threat: 1,
      tokens: 2,
    },
    {
      threat: 2,
      tokens: 5,
    },
    {
      threat: 3,
      tokens: 5,
    },
    {
      threat: 4,
      tokens: 4,
    },
  ],
  [TokenKeys.RED_PLAYER]: [
    {
      threat: 0,
      tokens: 1,
    },
  ],
  [TokenKeys.BLUE_PLAYER]: [
    {
      threat: 0,
      tokens: 1,
    },
  ],
  [TokenKeys.GREEN_PLAYER]: [
    {
      threat: 0,
      tokens: 1,
    },
  ],
  [TokenKeys.WHITE_PLAYER]: [
    {
      threat: 0,
      tokens: 1,
    },
  ],
  [TokenKeys.PURPLE_PLAYER]: [
    {
      threat: 0,
      tokens: 1,
    },
  ],
  [TokenKeys.ORANGE_PLAYER]: [
    {
      threat: 0,
      tokens: 1,
    },
  ],
  [TokenKeys.BLANK]: [
    {
      threat: 0,
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

function resetAllTokens(tokens: TokenKeys[]) {
  const ALL_TOKENS: SeederTokens[] = [];
  let key: keyof typeof TokenKeys;
  for (key of tokens) {
    const name = TokenKeys[key];
    let x = 0;
    for (const j in totalTokens[name]) {
      if (+j === 0) x = 0; // reset the outermost counter for every new token type
      const tt = totalTokens[name][j];
      for (let i = 0; i < tt.tokens; i++) {
        x++;
        ALL_TOKENS.push({
          name,
          threat: tt.threat,
          damage: 0,
          src: images[Seeders.BLANK],
          id: `${name}_${j}${i}`,
          rotation: x * (360 / totalCountPerIntruder[name]),
        });
      }
    }
  }
  return ALL_TOKENS;
}

Array.prototype.popRandom = function popRandom() {
  if (this.length === 0) return null;
  const index = Math.floor(Math.random() * this.length);
  const element = this[index];
  this.splice(index, 1);
  return element;
};

export function putRandomSeederIntoBag(state: GameState) {
  if (state.remainingTokens.length > 0) {
    const o = state.remainingTokens
      .filter((i) => i.name == TokenKeys.SEEDER)
      .popRandom() as SeederTokens;
    const index = state.remainingTokens.findIndex(
      (seeder) => seeder?.id === o.id
    );
    state.remainingTokens.splice(index, 1); // remove this one
    o.damage = 0;
    state.inBag.push(o);
  }
  return state;
}

export function putRandomSeederIntoRemaining(state: GameState) {
  const options = state.inBag.filter((i) => i.name == TokenKeys.SEEDER);
  if (options.length > 0) {
    const o = options?.popRandom() as SeederTokens;
    const index = state.inBag.findIndex((seeder) => seeder?.id === o.id);
    state.inBag.splice(index, 1); // remove this one
    state.remainingTokens.push(o);
  }
  return state;
}

/*  BLUE_PLAYER: "BLUE_PLAYER",
  ORANGE_PLAYER: "ORANGE_PLAYER",
  WHITE_PLAYER: "WHITE_PLAYER",
  PURPLE_PLAYER: "PURPLE_PLAYER",
  GREEN_PLAYER: "GREEN_PLAYER",
  RED_PLAYER: "RED_PLAYER",*/

type PlayerToken =
  | TokenKeys.BLUE_PLAYER
  | TokenKeys.ORANGE_PLAYER
  | TokenKeys.WHITE_PLAYER
  | TokenKeys.PURPLE_PLAYER
  | TokenKeys.GREEN_PLAYER
  | TokenKeys.RED_PLAYER;

export const newGame = (players: PlayerToken[] = []) => {
  const allTokens = resetAllTokens([
    TokenKeys.BLANK,
    TokenKeys.SEEDER,
    ...players,
  ]);
  const playerz = players.reduce(
    (acc: Record<PlayerToken, number>, p: PlayerToken) => {
      acc[p] = 1;
      return acc;
    },
    {} as Record<PlayerToken, number>
  );
  const startingCounts = {
    [TokenKeys.BLANK]: 1,
    [TokenKeys.SEEDER]: 2 + players.length,
    ...playerz,
  };
  const copy = [...objectives];
  const startingObjectives = [];
  for (let i = 0; i < players.length; i++)
    startingObjectives.push(copy.popRandom());

  const nonSeeders = allTokens.filter((s) => s.name != TokenKeys.SEEDER);
  const seeders = allTokens.filter((s) => s.name == TokenKeys.SEEDER);

  const newState: GameState = {
    inBag: nonSeeders,
    inPlay: [],
    developing: [],
    encounter: [],
    remainingTokens: seeders,
    log: [],
    logsOpen: false,
    startNewGame: true,
    objectives: startingObjectives,
    kills: 0,
  };

  for (let i = 0; i < startingCounts[TokenKeys.SEEDER]; i++) {
    putRandomSeederIntoBag(newState);
  }

  return newState;
};

type DevelopmentAction = (state: GameState) => GameState;
export const DevelopmentRules: {
  [key: string]: { message: string; action: DevelopmentAction };
} = {
  [TokenKeys.BLANK]: {
    message:
      "Add a random Void Seeder token to the intruder bag. Return the Blank token to the bag.",
    action: (state) => {
      const updated = putRandomSeederIntoBag(state);
      const token = updated.developing.pop() as SeederTokens; // should be the blank token
      updated.inBag.push(token);
      return state;
    },
  },
  [TokenKeys.SEEDER]: {
    message:
      "Return this token to the bag. <span class='font-bold underline'>All players perform a Noise roll</span> in turn order, unless their character is already in Combat with a Void Seeder or Lair.",
    action: (state) => {
      const token = state.developing.pop() as SeederTokens;
      state.inBag.push(token);
      return state;
    },
  },
  [TokenKeys.BLUE_PLAYER]: {
    message: `If the BLUE player is dead or escaped (pod/hybernating), remove this token from the bag and draw again. Otherwise, the <span class='font-bold underline'>Blue player resolves a panic card.</span> Return this token to the bag.`,
    action: (state) => {
      const token = state.developing.pop() as SeederTokens;
      state.inBag.push(token);
      return state;
    },
  },
  [TokenKeys.GREEN_PLAYER]: {
    message: `If the GREEN player is dead or escaped (pod/hybernating), remove this token from the bag and draw again. Otherwise, the <span class='font-bold underline'>Green player resolves a panic card.</span> Return this token to the bag.`,
    action: (state) => {
      const token = state.developing.pop() as SeederTokens;
      state.inBag.push(token);
      return state;
    },
  },
  [TokenKeys.WHITE_PLAYER]: {
    message: `If the WHITE player is dead or escaped (pod/hybernating), remove this token from the bag and draw again. Otherwise, the <span class='font-bold underline'>White player resolves a panic card.</span> Return this token to the bag.`,
    action: (state) => {
      const token = state.developing.pop() as SeederTokens;
      state.inBag.push(token);
      return state;
    },
  },
  [TokenKeys.ORANGE_PLAYER]: {
    message: `If the ORANGE player is dead or escaped (pod/hybernating), remove this token from the bag and draw again. Otherwise, the <span class='font-bold underline'>Orange player resolves a panic card.</span> Return this token to the bag.`,
    action: (state) => {
      const token = state.developing.pop() as SeederTokens;
      state.inBag.push(token);
      return state;
    },
  },
  [TokenKeys.RED_PLAYER]: {
    message: `If the RED player is dead or escaped (pod/hybernating), remove this token from the bag and draw again. Otherwise, the <span class='font-bold underline'>Red player resolves a panic card.</span> Return this token to the bag.`,
    action: (state) => {
      const token = state.developing.pop() as SeederTokens;
      state.inBag.push(token);
      return state;
    },
  },
  [TokenKeys.PURPLE_PLAYER]: {
    message: `If the PURPLE player is dead or escaped (pod/hybernating), remove this token from the bag and draw again. Otherwise, the <span class='font-bold underline'>Purple player resolves a panic card.</span> Return this token to the bag.`,
    action: (state) => {
      const token = state.developing.pop() as SeederTokens;
      state.inBag.push(token);
      return state;
    },
  },
};

export const EncounterMessages = {
  [TokenKeys.BLANK]: {
    message:
      "Place a noise counter on each corridor connected to the room in which this encounter took place. Return this token to the bag.",
  },
  [TokenKeys.SEEDER]: {
    message:
      "Check the insanity level of the player that drew this. Put the corresponding Void Seeker into play. Check for a surprise attack.",
  },
  [TokenKeys.BLUE_PLAYER]: {
    message:
      "Place a <span class='font-bold underline'>noise marker in each corridor</span> connected to the room where this encounter took place. The player who drew this token (color ignored) <span class='font-bold underline'>resolves a Panic card</span>. Return this token to the bag.",
  },
  [TokenKeys.ORANGE_PLAYER]: {
    message:
      "Place a <span class='font-bold underline'>noise marker in each corridor</span> connected to the room where this encounter took place. The player who drew this token (color ignored) <span class='font-bold underline'>resolves a Panic card</span>. Return this token to the bag.",
  },
  [TokenKeys.WHITE_PLAYER]: {
    message:
      "Place a <span class='font-bold underline'>noise marker in each corridor</span> connected to the room where this encounter took place. The player who drew this token (color ignored) <span class='font-bold underline'>resolves a Panic card</span>. Return this token to the bag.",
  },
  [TokenKeys.PURPLE_PLAYER]: {
    message:
      "Place a <span class='font-bold underline'>noise marker in each corridor</span> connected to the room where this encounter took place. The player who drew this token (color ignored) <span class='font-bold underline'>resolves a Panic card</span>. Return this token to the bag.",
  },
  [TokenKeys.RED_PLAYER]: {
    message:
      "Place a <span class='font-bold underline'>noise marker in each corridor</span> connected to the room where this encounter took place. The player who drew this token (color ignored) <span class='font-bold underline'>resolves a Panic card</span>. Return this token to the bag.",
  },
  [TokenKeys.GREEN_PLAYER]: {
    message:
      "Place a <span class='font-bold underline'>noise marker in each corridor</span> connected to the room where this encounter took place. The player who drew this token (color ignored) <span class='font-bold underline'>resolves a Panic card</span>. Return this token to the bag.",
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
        localStorage.setItem("void_nemesis_game", JSON.stringify(this.gs));
    };

    return descriptor;
  };
}

class StateManager {
  #gameState = $state<GameState>(newGame([TokenKeys.GREEN_PLAYER]));

  constructor() {
    if (browser && localStorage?.getItem("void_nemesis_game")) {
      const previous = JSON.parse(
        localStorage.getItem("void_nemesis_game") as string
      ) as GameState;
      this.#gameState = previous;
    }
  }

  get gs() {
    return this.#gameState;
  }

  @storeLocalNemesis()
  develop() {
    if (this.#gameState.inBag.length === 0) return;
    if (this.#gameState.developing.length > 0) return;
    const token = this.#gameState.inBag.popRandom();
    this.#gameState.developing.push(token);
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
    const token = this.#gameState.inBag.popRandom();
    this.#gameState.encounter = [token]; // Always save over encounter. Only one at a time.
    return this.#gameState;
  }

  @storeLocalNemesis()
  encounterDone() {
    if (this.#gameState.encounter.length === 0) return;
    const token = this.#gameState.encounter.pop()!;
    this.captureLog(
      `Encounter: ${token.name} (threat: ${token.threat}). ${
        EncounterMessages[token.name]
      }`
    );
    if (token.name == TokenKeys.SEEDER) {
      this.#gameState.inPlay.push({
        ...token,
        color: "transparent",
        image: `${base}/nemesis/BlankOfficial.webp`,
      });
    } else {
      this.#gameState.inBag.push(token);
    }
    return this.#gameState;
  }

  @storeLocalNemesis()
  kill(tokenId: string) {
    if (this.#gameState.inPlay.length === 0) return;
    const index = this.#gameState.inPlay.findIndex((i) => i.id === tokenId);
    if (index < 0) return;
    const token = this.#gameState.inPlay[index];
    this.#gameState.inPlay.splice(index, 1);
    this.#gameState.kills += 1;
    this.#gameState.remainingTokens.push(token);
    putRandomSeederIntoBag(this.#gameState);
    this.captureLog(`Killed ${token.name}.`);
    return this.#gameState;
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
    return this.#gameState;
  }

  @storeLocalNemesis()
  setImage(tokenId: string, image: string) {
    if (this.#gameState.inPlay.length === 0) return;
    const index = this.#gameState.inPlay.findIndex((i) => i.id === tokenId);
    if (index < 0) return;
    if (this.#gameState.inPlay[index].image === image) return; // do nothing if no change
    this.#gameState.inPlay[index].image = image;
    return this.#gameState;
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
    return this.#gameState;
  }

  @storeLocalNemesis()
  returnToBag(tokenId: string) {
    if (this.#gameState.inPlay.length === 0) return;
    const index = this.#gameState.inPlay.findIndex((i) => i.id === tokenId);
    if (index < 0) return;
    const token = this.#gameState.inPlay[index];
    this.captureLog(`Returned ${token.name} to bag.`);
    token.damage = 0;
    this.#gameState.inPlay.splice(index, 1);
    this.#gameState.inBag.push(token);
    return this.#gameState;
  }

  @storeLocalNemesis()
  putInBagFromRemaining(name: SeederTokens["name"]) {
    if (this.#gameState.remainingTokens.length === 0) return;
    const matches = this.#gameState.remainingTokens.filter(
      (t) => t.name == name
    );
    const token = matches.popRandom();
    if (!token) return;
    this.#gameState.inBag.push(token);
    this.#gameState.remainingTokens = this.#gameState.remainingTokens.filter(
      (t) => t.id != token.id
    );
    this.captureLog(`Added ${name} to bag from remaining.`);
  }

  @storeLocalNemesis()
  putInRemainingFromBag(name: SeederTokens["name"]) {
    if (name == TokenKeys.BLANK) return;
    if (this.#gameState.inBag.length === 0) return;
    const matches = this.#gameState.inBag.filter((t) => t.name == name);
    const token = matches.popRandom();
    if (!token) return;
    this.#gameState.remainingTokens.push(token);
    this.#gameState.inBag = this.#gameState.inBag.filter(
      (t) => t.id !== token.id
    );
    this.captureLog(`Added ${name} to remaining from bag.`);
  }

  @storeLocalNemesis()
  toggleNewGamePrompt() {
    this.#gameState.startNewGame = !this.#gameState.startNewGame;
  }

  @storeLocalNemesis()
  newGame(players: PlayerToken[]) {
    const gs = newGame(players);
    this.#gameState.startNewGame = false;
    this.#gameState = gs;
    this.captureLog(`New game with ${JSON.stringify(players)}.`);
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
const STATE_KEY = Symbol("SEEDERS_GAME_STATE_KEY");

export function setStateManager() {
  return setContext(STATE_KEY, new StateManager());
}

export function getStateManager() {
  return getContext<ReturnType<typeof setStateManager>>(STATE_KEY);
}
