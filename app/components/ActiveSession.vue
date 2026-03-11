<script setup>
import {ref, computed, nextTick} from 'vue';
import {useGameStore} from "~/stores/useGame.ts";
import {useNotebookStore} from "~/stores/useNotebook.ts";
import {storeToRefs} from 'pinia';
import {SESSION_COUNT} from "~/composables/usePatientSession.ts";

const props = defineProps({
  session: Number,
  totalSessions: Number,
  openness: Number,
  isStreaming: Boolean,
  sessionMessagesCount: Number,
  currentEmotion: String,
  currentDialogue: String,
  canEndSession: Boolean
});

const emit = defineEmits(['send', 'saveNote', 'toggleJournal', 'endSession']);

const {character} = useGameStore();
const {mindReadingsAvailable, phoneCallsAvailable, previousDiary, isDiaryOpen, isMothershipOpen} = storeToRefs(useGameStore());

const notebook = useNotebookStore();
const {selectedDistortions} = storeToRefs(notebook);

const lastThought = ref();
const showInsightMenu = ref(false);
const characterImagePath = computed(() => `/character/${character.toLowerCase()}/${props.currentEmotion}.png`);
const background = "/backgrounds/background1.png";

const storedQuote = ref(false)

// Tooltip/State Logic
const hoveredCard = ref(null);
const hoveredButton = ref(null);
const tooltipRef = ref(null);
const tooltipStyle = ref({top: '0px', left: '0px', opacity: 0});

function goToQuote() {
  notebook.openAtPage(2)
}

const updateMouse = (e) => {
  nextTick(() => {
    if (!tooltipRef.value) return;
    const tooltipWidth = tooltipRef.value.offsetWidth;
    const tooltipHeight = tooltipRef.value.offsetHeight;
    const padding = 30;

    let x = e.clientX + 25;
    if (x + tooltipWidth > window.innerWidth - padding) x = e.clientX - tooltipWidth - 25;

    const mouseYPercent = e.clientY / window.innerHeight;
    const yPivot = tooltipHeight * mouseYPercent;
    let y = e.clientY - yPivot;

    if (y < padding) y = padding;
    if (y + tooltipHeight > window.innerHeight - padding) y = window.innerHeight - tooltipHeight - padding;

    tooltipStyle.value = {top: `${y}px`, left: `${x}px`, opacity: 1};
  });
};

const saveInsight = (distortion) => {
  emit('saveNote', {distortionId: distortion.id});
  storedQuote.value = true
  showInsightMenu.value = false;
};

const userInput = ref('');
const handleSend = () => {
  if (!userInput.value.trim() || props.sessionMessagesCount <= 0) return;
  emit('send', userInput.value);
  userInput.value = '';
  lastThought.value = undefined;
  storedQuote.value = false
};

function showThought() {
  mindReadingsAvailable.value -= 1;
  lastThought.value = props.currentDialogue.thought
}

const hoverDetails = {
  'journal': {title: 'Patient Journal', desc: 'Access the patient\'s past entries and your own clinical notes.'},
  'diary': {title: 'Diary', desc: 'Access the diary from the patient.'},
  'phone': {title: 'Contact Mothership', desc: 'Contact the mothership for advice.'},
  'mind': {title: 'Memory Access', desc: 'Review previously stored patient insights.'},
  'mind-control': {title: 'Mind Reading', desc: 'Read the current thoughts of the user.'},
  'end': {title: 'Early End Session', desc: 'Wrap up the session.'}
};

// 3. Computed property to safely resolve the active content
const activeHover = computed(() => {
  return hoverDetails[hoveredButton.value] || {
    title: 'Interaction Panel',
    desc: 'Hover over an icon to see details.'
  };
});

const isFirstMessage = computed(() => {
  return !!props.currentDialogue?.firstMessage
})
</script>

<template>
  <div class="h-dvh w-full flex flex-col overflow-hidden bg-slate-900 bg-cover bg-center"
       :style="{ backgroundImage: `url(${background})` }">

    <div class="absolute inset-0 bg-black/60 pointer-events-none"></div>

    <header class="flex-none w-full p-8 flex justify-end items-start z-30 absolute right-2">
      <div class="flex gap-4">
        <div class="bg-black/80 border border-slate-700 px-4 py-2 rounded-sm text-center">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Session</p>
          <p class="text-xl font-black text-white">{{ session }} / {{ SESSION_COUNT }}</p>
        </div>
        <div class="bg-black/80 border border-slate-700 px-4 py-2 rounded-sm text-center">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Messages Left</p>
          <p class="text-xl font-black" :class="sessionMessagesCount < 3 ? 'text-red-500' : 'text-blue-400'">
            {{ sessionMessagesCount }}</p>
        </div>
      </div>
    </header>

    <main class="flex-grow relative flex items-end justify-center overflow-hidden z-20">
      <div class="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
      </div>

      <div class="absolute left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">

        <div v-for="distortion in selectedDistortions" :key="distortion.id"
             @click="() => {
               hoveredCard = null
               notebook.openAtPage(1)
             }"
             @mouseenter="hoveredCard = distortion; hoveredButton = null; updateMouse($event)"

             @mouseleave="hoveredCard = null"

             class="w-16 h-20 border-2 border-slate-700 bg-black p-0.5 hover:border-emerald-500 transition-all cursor-pointer shadow-lg">

          <img :src="distortion.image" class="w-full h-full object-cover"/>

        </div>

      </div>

      <transition name="sprite-swap" mode="out-in">
        <img :key="currentEmotion" :src="characterImagePath"
             class="max-h-[50vh] z-500 object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"/>
      </transition>

      <Transition name="fade">
        <div v-if="lastThought"
             class="absolute top-[20%] left-[calc(50%+120px)] z-40 p-4 bg-white text-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-slate-200 max-w-[320px]">
          <p class="italic font-serif text-lg leading-snug">"{{ lastThought }}"</p>
          <div class="absolute -bottom-6 left-10 w-6 h-6 bg-white rounded-full border-4 border-slate-200"></div>
          <div class="absolute -bottom-10 left-5 w-4 h-4 bg-white rounded-full border-4 border-slate-200"></div>
        </div>
      </Transition>
    </main>

    <footer class="flex-none pb-6 w-full max-w-[1000px] mx-auto z-40">
      <div class="flex items-end gap-4 justify-center">
        <div class="flex-1 bg-slate-950/90 border-2 border-slate-800 rounded-sm p-6 shadow-2xl">
          <div class="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
            <span class="text-xl font-black uppercase tracking-[0.2em] text-emerald-500">{{ character }}</span>
            <div class="w-52 -mt-3">
              <div class="flex justify-between text-[12px] uppercase font-black text-slate-400">
                <span>Patient Trust</span>
                <span :class="openness < 30 ? 'text-red-500' : 'text-emerald-400'">{{ openness }}%</span>
              </div>
              <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-700 bg-emerald-500" :style="{ width: openness + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="mb-6 min-h-[120px] max-h-[120px]">
            <div
                class="text-lg text-slate-200 max-h-[100px] leading-relaxed font-medium italic overflow-y-auto  custom-scroll pr-2">
              {{ currentDialogue.text }}
            </div>

            <div class="relative w-fit mt-2"
                 @mouseenter="!storedQuote && !isFirstMessage ? showInsightMenu = true : showInsightMenu = false"
                 @mouseleave="showInsightMenu = false">
              <Transition enter-active-class="transition-opacity duration-700 delay-500 ease-in-out"
                          leave-active-class="transition-opacity duration-0 ease-in-out"
                          enter-from-class="opacity-0" leave-to-class="opacity-0">
                <button v-if="currentDialogue.text !== ''" @click="storedQuote ? goToQuote() : null"
                        :disabled="isFirstMessage"
                        class="items-center gap-2 bg-emerald-900/50 border border-emerald-500/50 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-400 transition-all
                 hover:bg-emerald-600 hover:text-white
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-900/50 disabled:hover:text-emerald-400 disabled:border-slate-700">
                  <span>📝</span> {{ storedQuote ? 'Quote Stored' : 'Store Quote' }}
                </button>
              </Transition>

              <Transition name="fade">
                <div v-if="showInsightMenu"
                     class="absolute bottom-full left-0 w-64 bg-slate-900 border-2 border-emerald-500 shadow-2xl z-50 overflow-hidden">
                  <div class="p-3 border-b border-slate-800 bg-slate-950">
                    <p class="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Assign Distortion</p>
                  </div>
                  <div class="max-h-64 overflow-y-auto custom-scroll">
                    <button v-for="d in selectedDistortions" :key="d.id" @click="saveInsight(d)"
                            class="w-full flex items-center gap-3 p-2 hover:bg-emerald-900/30 transition-all text-left">
                      <img :src="d.image" class="w-8 h-10 object-cover border border-slate-700"/>
                      <span class="text-[10px] font-bold text-white">{{ d.title }}</span>
                    </button>
                    <button @click="saveInsight({ id: null })"
                            class="w-full p-3 bg-slate-800 hover:bg-slate-700 transition-all text-left text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-800">
                      [ Unknown Distortion ]
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          <div
              class="relative flex items-center bg-black/40 border-2 border-slate-800 px-4 py-3 rounded-sm min-h-[56px]">
            <template v-if="sessionMessagesCount > 0">
              <span class="text-emerald-500 font-black mr-4 opacity-50">❯</span>
              <input v-model="userInput" @keyup.enter="handleSend"
                     class="w-full bg-transparent outline-none text-emerald-400 font-bold text-lg"
                     placeholder="Enter wisdom..."/>
            </template>
            <button v-else @click="$emit('endSession')"
                    class="w-full flex items-center justify-center gap-2 py-2 font-black uppercase tracking-widest text-emerald-400 hover:text-white hover:bg-emerald-900/20 transition-all animate-pulse">
              <span>Finish session</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-2 pb-1">
          <div class="flex gap-2">
            <div class="flex flex-col gap-2">
              <button
                  :disabled="mindReadingsAvailable === 0 || !currentDialogue.thought || currentDialogue.thought === lastThought"
                  @click="showThought"
                  @mouseenter="hoveredButton = 'mind-control'; hoveredCard = null; updateMouse($event)"
                  @mouseleave="hoveredButton = null"
                  :class="[
            'w-14 h-14 border-2 text-xl shadow-xl flex items-center justify-center relative transition-all',
            mindReadingsAvailable!==0 && currentDialogue.thought && currentDialogue.thought !== lastThought ? 'bg-slate-800 border-slate-700 hover:bg-amber-900 cursor-pointer' : 'bg-slate-950 border-slate-800 opacity-50 grayscale cursor-not-allowed'
          ]">
                👁️
                <span class="absolute top-0 right-0 text-[11px] font-black text-white px-1 -mt-1 rounded-bl-sm">
          {{ mindReadingsAvailable }}
        </span>
              </button>

              <button
                  @click="isMothershipOpen = !isMothershipOpen"
                  @mouseenter="hoveredButton = 'phone'; hoveredCard = null; updateMouse($event)"
                  @mouseleave="hoveredButton = null"
                  :class="[
            'w-14 h-14 border-2 text-xl shadow-xl flex items-center justify-center relative transition-all',
          'bg-slate-800 border-slate-700 hover:bg-purple-900 cursor-pointer'
          ]">
                ☎️

              </button>
            </div>

            <div class="flex flex-col gap-2">
              <button
                  @mouseenter="hoveredButton = 'diary'; hoveredCard = null; updateMouse($event)"
                  :disabled="!previousDiary"
                  @mouseleave="hoveredButton = null"
                  @click="isDiaryOpen=true"
                  :class="[
            'w-14 h-14 border-2 text-xl shadow-xl flex items-center justify-center relative transition-all',
            previousDiary ? 'bg-slate-800 border-slate-700 hover:bg-amber-900 cursor-pointer' : 'bg-slate-950 border-slate-800 opacity-50 grayscale cursor-not-allowed'
          ]">
                📔
              </button>

              <button @click="$emit('toggleJournal')"
                      @mouseenter="hoveredButton = 'journal'; hoveredCard = null; updateMouse($event)"
                      @mouseleave="hoveredButton = null"
                      class="w-14 h-14 bg-slate-800 border-2 border-slate-700 hover:bg-blue-900 text-xl shadow-xl flex items-center justify-center">
                📖
              </button>
            </div>
          </div>

          <button v-if="canEndSession" @click="$emit('endSession')"
                  @mouseenter="hoveredButton = 'end'; hoveredCard = null; updateMouse($event)"
                  @mouseleave="hoveredButton = null"
                  class="w-full h-14 border-2 transition-all text-xl shadow-xl flex items-center justify-center"
                  :class="sessionMessagesCount === 0 ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-red-900 hover:text-white'">
            ⏻
          </button>
        </div>
      </div>
    </footer>

    <Transition name="fade" leave-active-class="duration-0">

      <div v-if="hoveredCard || hoveredButton"

           ref="tooltipRef"

           class="fixed z-[300] w-[420px] bg-[#fdfaf3] border-2 border-slate-400 shadow-2xl p-6 rounded-sm pointer-events-none"

           :style="tooltipStyle">


        <template v-if="hoveredCard">

          <div class="flex items-center gap-3 p-3 border-b-2 border-slate-900 bg-white">
            <div class="w-14 h-14 shrink-0 border border-slate-200 overflow-hidden bg-slate-100">
              <img :src="hoveredCard.image" class="w-full h-full object-cover"/>
            </div>
            <div class="flex flex-col overflow-hidden">
              <h3 class="text-xl font-black uppercase text-slate-900 leading-tight truncate">
                {{ hoveredCard.title }}
              </h3>
              <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                {{ hoveredCard.clinicalName }}
              </p>
            </div>
          </div>

          <div class="p-3 flex flex-col gap-3 overflow-y-auto max-h-[75vh]">

            <p class="text-[13px] text-slate-700 italic border-l-2 border-slate-300 pl-3 leading-snug">
              "{{ hoveredCard.description }}"
            </p>

            <div class="grid grid-cols-2 gap-2">
              <div class="border border-slate-900 bg-red-50/50 p-2">
                <p class="text-[9px] font-black uppercase text-red-600 mb-0.5">Example</p>
                <p class="text-[13px] text-slate-900 font-bold leading-tight">
                  "{{ hoveredCard.example }}"
                </p>
              </div>
              <div class="border border-slate-900 bg-emerald-50/50 p-2">
                <p class="text-[9px] font-black uppercase text-emerald-700 mb-0.5">Re-Frame</p>
                <p class="text-[13px] text-slate-900 font-bold leading-tight">
                  "{{ hoveredCard.counterExample }}"
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="bg-white border border-slate-200 p-2">
                <p class="text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Inquiry Protocol</p>
                <ul class="space-y-1">
                  <li v-for="ref in hoveredCard.generalCounters" :key="ref"
                      class="text-[12px] text-slate-800 leading-tight flex gap-1.5">
                    <span class="text-emerald-500 font-bold">•</span>
                    {{ ref }}
                  </li>
                </ul>
              </div>

              <div class="border-t border-slate-200 pt-2">
                <p class="text-[9px] font-black uppercase text-slate-900 mb-0.5 italic">Diagnostic Goal:</p>
                <p class="text-[12px] text-slate-600 leading-snug italic">
                  {{ hoveredCard.therapistTip }}
                </p>
              </div>
            </div>
          </div>

        </template>


        <template v-if="hoveredButton">

          <h3 class="text-xl font-black uppercase text-slate-900">
            {{ activeHover.title }}
          </h3>

          <p class="text-sm text-slate-600 font-medium">
            {{ activeHover.desc }}
          </p>

        </template>

      </div>

    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.sprite-swap-enter-active, .sprite-swap-leave-active {
  transition: all 0.5s ease;
}

.sprite-swap-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.sprite-swap-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #065f46; /* Tailwind emerald-800 */
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #1e293b; /* Tailwind slate-800 */
}
</style>