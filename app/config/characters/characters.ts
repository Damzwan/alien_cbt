import {MARA} from "~/config/characters/mara";
import {KAELEN} from "~/config/characters/kaelen";

export type Character = {
    name: string;
    lore: string;
    events: GameEvent[]
    speechGuidelines: string
}

export type GameEvent = {
    id: string;
    title: string;
    description: string;
}

export enum CHARACTERS {
    MARA = 'MARA',
    KAELEN = 'KAELEN',
}

export const all_characters: Record<CHARACTERS, Character> = {
    [CHARACTERS.MARA]: MARA,
    [CHARACTERS.KAELEN]: KAELEN,
}