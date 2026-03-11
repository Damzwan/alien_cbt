<script setup>
import { ref, nextTick } from 'vue';
import { distortionCards } from "~/config/distortions.ts";
import { useNotebookStore } from "~/stores/useNotebook.ts";
import { storeToRefs } from 'pinia';

const notebook = useNotebookStore();
const { selectedDistortions } = storeToRefs(notebook);

const hoveredCard = ref(null);
const tooltipRef = ref(null);
const tooltipStyle = ref({ top: '0px', left: '0px', opacity: 0 });

const showInfo = async (card, event) => {
  hoveredCard.value = card;

  await nextTick();
  if (!tooltipRef.value) return;

  const tooltipWidth = tooltipRef.value.offsetWidth;
  const tooltipHeight = tooltipRef.value.offsetHeight;
  const padding = 30;

  let x = event.clientX + 25;
  if (x + tooltipWidth > window.innerWidth - padding) {
    x = event.clientX - tooltipWidth - 25;
  }

  const mouseYPercent = event.clientY / window.innerHeight;
  const yPivot = tooltipHeight * mouseYPercent;
  let y = event.clientY - yPivot;

  if (y < padding) y = padding;
  if (y + tooltipHeight > window.innerHeight - padding) {
    y = window.innerHeight - tooltipHeight - padding;
  }

  tooltipStyle.value = {
    top: `${y}px`,
    left: `${x}px`,
    opacity: 1
  };
};

const closeInfo = () => {
  hoveredCard.value = null;
  tooltipStyle.value.opacity = 0;
};

const toggleSelection = (card) => {
  const index = selectedDistortions.value.findIndex(c => c.id === card.id);
  if (index > -1) {
    selectedDistortions.value.splice(index, 1);
  } else if (selectedDistortions.value.length < 3) {
    selectedDistortions.value.push(card);
  }
};
</script>

<template>
  <div class="flex-1 flex flex-col p-12 bg-white overflow-hidden relative">

    <header class="mb-6 border-b-2 border-slate-900 pb-4">
      <h2 class="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Distortion Catalog</h2>
    </header>

    <div class="mb-10">
      <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Active Diagnostic Toolkit
      </h3>

      <div class="flex justify-center gap-6">
        <div v-for="i in 3" :key="i"
             class="w-48 h-56 border-2 rounded-sm relative overflow-hidden transition-all bg-slate-50 flex flex-col"
             :class="selectedDistortions[i-1] ? 'border-slate-900 shadow-[4px_4px_0px_black]' : 'border-dashed border-slate-200'">

          <template v-if="selectedDistortions[i-1]">
            <div @mouseenter="showInfo(selectedDistortions[i-1], $event)"
                 @mouseleave="closeInfo"
                 class="absolute top-2 right-2 z-10 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center cursor-help shadow-sm hover:bg-emerald-600 transition-colors">
              <span class="font-bold text-[10px]">i</span>
            </div>

            <div class="h-3/5 overflow-hidden bg-slate-200">
              <img :src="selectedDistortions[i-1].image" class="w-full h-full object-cover"/>
            </div>
            <div class="flex-1 p-3 flex flex-col justify-between bg-white border-t border-slate-900">
              <h4 class="text-[11px] font-black uppercase text-slate-900 leading-tight">
                {{ selectedDistortions[i - 1].title }}
              </h4>
              <button @click.stop="toggleSelection(selectedDistortions[i-1])"
                      class="text-[9px] font-black text-red-500 uppercase hover:text-red-700 text-left">
                [ Deselect ]
              </button>
            </div>
          </template>

          <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div class="w-8 h-8 border border-slate-200 rounded-full mb-2 flex items-center justify-center text-slate-200 text-xs">
              +
            </div>
            <span class="text-[9px] font-mono text-slate-300 uppercase tracking-widest leading-tight">Empty Slot 0{{ i }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col overflow-hidden">
      <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">Available Patterns</h3>

      <div class="flex-1 overflow-y-auto pr-4 scrollbar-hide">
        <div class="grid grid-cols-2 gap-3 pb-20">
          <div v-for="card in distortionCards" :key="card.id"
               @click="toggleSelection(card)"
               :class="['group relative flex h-28 border-2 rounded-sm cursor-pointer transition-all overflow-hidden',
                        selectedDistortions.some(c => c.id === card.id)
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : 'border-slate-100 hover:border-slate-300 bg-white']">

            <div @mouseenter="showInfo(card, $event)"
                 @mouseleave="closeInfo"
                 class="absolute bottom-2 right-2 z-10 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center cursor-help hover:bg-emerald-600 transition-colors">
              <span class="font-bold text-[10px]">i</span>
            </div>

            <div class="w-20 bg-slate-100 border-r border-slate-100 overflow-hidden">
              <img :src="card.image" class="w-full h-full opacity-75 group-hover:opacity-100 transition-all duration-300"/>
            </div>

            <div class="flex-1 p-4 flex flex-col justify-center">
              <div class="flex justify-between items-center mb-1">
                <h4 class="text-sm font-black uppercase text-slate-800 tracking-tight">{{ card.title }}</h4>
                <div v-if="selectedDistortions.some(c => c.id === card.id)"
                     class="text-[7px] font-black bg-emerald-500 text-white px-1 py-0.5 rounded-sm">SELECTED</div>
              </div>
              <p class="text-[11px] text-slate-500 leading-tight italic line-clamp-2">"{{ card.description }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="hoveredCard"
           ref="tooltipRef"
           class="fixed pointer-events-none z-[300] w-[400px] bg-[#fdfaf3] border-2 border-slate-900 shadow-2xl rounded-sm flex flex-col overflow-hidden"
           :style="tooltipStyle">

        <div class="flex items-center gap-3 p-3 border-b-2 border-slate-900 bg-white">
          <div class="w-14 h-14 shrink-0 border border-slate-200 overflow-hidden bg-slate-100">
            <img :src="hoveredCard.image" class="w-full h-full object-cover" />
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
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>