import {defineStore} from 'pinia';
import {ref} from 'vue';
import {CHARACTERS} from "~/config/characters/characters";

export const MIND_READINGS = 3
export const PHONE_CALLS = 3

export const useGameStore = defineStore('game', () => {
    const character = ref<CHARACTERS>();
    const gameStarted = ref(false);

    const isDiaryOpen = ref(false);
    const previousDiary = ref(null);

    const mindReadingsAvailable = ref(MIND_READINGS);
    const phoneCallsAvailable = ref(PHONE_CALLS);

    const isMothershipOpen = ref(false);
    const isMothershipExchangeActive = ref(false);
    const mothershipChatHistory = ref([]);

    return {
        character,
        gameStarted,
        mindReadingsAvailable,
        phoneCallsAvailable,
        previousDiary,
        isDiaryOpen,
        isMothershipOpen,
        mothershipChatHistory,
        isMothershipExchangeActive
    }
});