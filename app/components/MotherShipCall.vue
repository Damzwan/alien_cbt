<script setup>
import { ref, watch, nextTick, computed, useTemplateRef } from 'vue';
import { useGameStore } from "~/stores/useGame.ts";
import { storeToRefs } from 'pinia';
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  currentPatientText: String
});

const gameStore = useGameStore();
const { phoneCallsAvailable, isMothershipOpen, mothershipChatHistory, isMothershipExchangeActive} = storeToRefs(gameStore);

const scrollContainer = ref(null);
const messageInput = ref('');
const isProcessing = ref(false);

const exchangesPerSession = 3;
const exchangesLeft = ref(0);

const scrollToBottom = async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

/**
 * Handles the graceful shutdown of the current communication line.
 */
const terminateConnection = (reason = 'quota') => {
  isMothershipExchangeActive.value = false;
  exchangesLeft.value = 0;

  const goodbyeMessages = {
    quota: "Uplink quota reached. Terminating secure line. Good luck, Operative.",
    manual: "Connection closed by Operative. Standing by for next transmission.",
    generic: "Signal lost. Re-initiate when ready."
  };

  mothershipChatHistory.value.push({
    role: 'alien',
    text: goodbyeMessages[reason] || goodbyeMessages.generic
  });

  scrollToBottom();
};

const startExchange = () => {
  if (phoneCallsAvailable.value > 0) {
    phoneCallsAvailable.value -= 1;
    isMothershipExchangeActive.value = true;
    exchangesLeft.value = exchangesPerSession;

    mothershipChatHistory.value.push({
      role: 'alien',
      text: "Connection established. Secure line open. Provide patient context for HQ analysis (3 queries remaining)."
    });
    scrollToBottom();
  }
};

const sendToMothership = async () => {
  if (!messageInput.value.trim() || !isMothershipExchangeActive.value || isProcessing.value || exchangesLeft.value === 0) return;

  const userText = messageInput.value;
  messageInput.value = '';
  exchangesLeft.value -= 1;

  mothershipChatHistory.value.push({ role: 'player', text: userText });
  isProcessing.value = true;
  await scrollToBottom();

  // Simulation of backend call
  try {
    setTimeout(() => {
      mothershipChatHistory.value.push({
        role: 'alien',
        text: `ANALYSIS: Subject is demonstrating specific cognitive distortions. Consider using a 'Socratic Questioning' approach regarding their statement: "${props.currentPatientText?.substring(0, 25)}..."`
      });
      isProcessing.value = false;
      scrollToBottom();

      // Check if that was the last exchange
      if (exchangesLeft.value === 0) {
        setTimeout(() => terminateConnection('quota'), 1000);
      }
    }, 1500);
  } catch (e) {
    isProcessing.value = false;
  }
};

watch(isMothershipOpen, (val) => {
  if (val) scrollToBottom();
});

const target = useTemplateRef('target');
onClickOutside(target, () => isMothershipOpen.value = false);
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isMothershipOpen" ref="target"
         class="fixed bottom-24 right-8 z-[100] w-[380px] bg-slate-950 border-2 border-slate-800 shadow-2xl flex flex-col overflow-hidden rounded-sm">

      <div class="bg-slate-900 border-b border-slate-800 p-3">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-purple-400 font-black uppercase text-xs tracking-widest flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_5px_white]" :class="{'animate-pulse': isMothershipExchangeActive}"></span>
              Mothership Uplink
            </h3>
            <p class="text-[9px] text-slate-500 font-bold uppercase mt-1">
              Clinical Advice Channel
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span v-if="isMothershipExchangeActive" class="text-[10px] font-black text-purple-500/50 uppercase tracking-tighter">
              Active Session: {{ exchangesLeft }} left
            </span>
            <button @click="isMothershipOpen = false" class="text-slate-600 hover:text-white transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div ref="scrollContainer"
           class="h-64 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-950 custom-scroll">

        <div v-if="mothershipChatHistory.length === 0"
             class="h-full flex flex-col items-center justify-center opacity-40 text-center">
          <span class="text-3xl mb-2">📡</span>
          <p class="text-[10px] font-black text-slate-500 uppercase">Uplink Standby</p>
        </div>

        <div v-for="(msg, idx) in mothershipChatHistory" :key="idx"
             :class="[
               'max-w-[90%] p-2 text-[12px] leading-snug border transition-all',
               msg.role === 'alien'
                ? 'bg-slate-900 border-slate-800 text-slate-300 self-start italic'
                : 'bg-purple-900/20 border-purple-500/30 text-purple-100 self-end text-right'
             ]">
          <p v-if="msg.role === 'alien'" class="text-[8px] uppercase font-black text-purple-500 mb-1 not-italic tracking-widest">HQ Response</p>
          {{ msg.text }}
        </div>

        <div v-if="isProcessing"
             class="self-start text-[10px] font-black text-purple-500 animate-pulse uppercase tracking-widest py-2">
          Decrypting Transmission...
        </div>
      </div>

      <div class="p-3 bg-slate-900 border-t border-slate-800">
        <div v-if="!isMothershipExchangeActive" class="flex flex-col gap-2">
          <button @click="startExchange"
                  :disabled="phoneCallsAvailable === 0"
                  class="w-full py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-[10px] font-black uppercase tracking-widest transition-all">
            {{ phoneCallsAvailable > 0 ? `Initiate Uplink (${phoneCallsAvailable} Available)` : 'Uplink Credits Depleted' }}
          </button>
        </div>

        <div v-else class="flex flex-col gap-2">
          <div class="flex gap-2">
            <input
                v-model="messageInput"
                @keyup.enter="sendToMothership"
                placeholder="Request analysis..."
                class="flex-1 bg-black border border-slate-700 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-purple-500 transition-colors"
            />
            <button
                @click="sendToMothership"
                :disabled="isProcessing || !messageInput.trim() || exchangesLeft === 0"
                class="bg-purple-600 hover:bg-purple-500 text-white px-3 text-[10px] font-black uppercase transition-colors disabled:opacity-30"
            >
              Send
            </button>
          </div>
          <button @click="terminateConnection('manual')"
                  class="text-[8px] text-slate-500 uppercase font-black hover:text-red-400 self-center tracking-widest transition-colors">
            — Emergency Cut Signal —
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>