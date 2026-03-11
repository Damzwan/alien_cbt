<script setup>
import {useNotebookStore} from "~/stores/useNotebook.ts";
import {useGameStore} from "~/stores/useGame.ts";
import {all_characters} from "~/config/characters/characters.ts";
import MotherShipCall from "~/components/MotherShipCall.vue";

const {
  messages, openness, isStreaming, sendMessage, start,
  startNextSession, currentEmotion, sessionPhase, reviewResult,
  session, sessionMessagesCount, runSessionReview, finalResult, firstMessage
} = usePatientSession();

const {addNote, toggle} = useNotebookStore();

const {gameStarted, character} = storeToRefs(useGameStore())

const currentDialogue = computed(() => {
  const modelMessages = messages.value.filter(m => m.role === 'model');
  return modelMessages.length > 0 ? modelMessages[modelMessages.length - 1] : {text: firstMessage, firstMessage: true};
});

const canEndSession = computed(() => (sessionMessagesCount.value <= 3 || sessionMessagesCount.value === 0) && sessionPhase.value === 'active');

const handleCharacterSelect = (selectedChar) => {
  character.value = selectedChar;
  start();
};

const route = useRoute();
onMounted(() => {
  const {started, char} = route.query;

  if (started === 'true') {
    gameStarted.value = true;
  }

  // Check if "char" matches a key in your all_characters config (e.g., ?char=MARA)
  if (char && all_characters[char.toUpperCase()]) {
    character.value = char.toUpperCase();
    gameStarted.value = true;
    start();
  }
});
</script>

<template>
  <div
      class="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden font-mono relative">


    <GameIntro v-if="!gameStarted"/>

    <PatientSelect
        v-else-if="gameStarted && !character"
        @select="handleCharacterSelect"
    />

    <div v-else class="w-full h-full flex flex-col items-center justify-center">
      <ActiveSession
          v-if="sessionPhase === 'active'"
          :session="session"
          :openness="openness"
          :messages="messages"
          :is-streaming="isStreaming"
          :session-messages-count="sessionMessagesCount"
          :current-emotion="currentEmotion"
          :current-dialogue="currentDialogue"
          :can-end-session="canEndSession"
          @send="sendMessage"
          @save-note="({distortionId}) => addNote(currentDialogue.text, session, distortionId)"
          @toggle-journal="toggle"
          @end-session="runSessionReview"
      />

      <JournalWorkspace :current-session="session"/>

      <SessionReview
          :phase="sessionPhase"
          :review="reviewResult"
          :onNext="startNextSession"
          :session-number="session"
          :finalReview="finalResult"
      />

      <DiaryViewer :session="session - 1"/>

      <MotherShipCall/>

    </div>


  </div>
</template>