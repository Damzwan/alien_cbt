<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useNotebookStore } from "~/stores/useNotebook.ts";
import { storeToRefs } from 'pinia';

const notebook = useNotebookStore();
const { selectedDistortions } = storeToRefs(notebook);

const activeSelectorIdx = ref(null);
const popoverPosition = ref({ top: 0, left: 0 });

const handleClickOutside = (e) => {
  const isSelector = e.target.closest('.distortion-selector-container');
  const isPopover = e.target.closest('.journal-popover');
  if (!isSelector && !isPopover) activeSelectorIdx.value = null;
};

onMounted(() => window.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => window.removeEventListener('mousedown', handleClickOutside));

const toggleSelector = (e, idx) => {
  if (activeSelectorIdx.value === idx) {
    activeSelectorIdx.value = null;
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  popoverPosition.value = {
    top: rect.top + window.scrollY,
    left: rect.left + rect.width + 10
  };
  activeSelectorIdx.value = idx;
};

const selectPattern = (stack, patternId) => {
  stack.linkedPatternId = patternId;
  activeSelectorIdx.value = null;
};
</script>

<template>
  <div class="flex-1 flex flex-col p-12 overflow-hidden bg-white relative">
    <header class="mb-6 border-b-2 border-slate-900 pb-4">
      <h2 class="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Raw Data Extraction</h2>
      <p class="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-1">
        Neural Pattern Matching // Evidence Log
      </p>
    </header>

    <div class="flex-1 overflow-y-auto pr-4 space-y-4 pb-32 scrollbar-hide">
      <div v-for="(stack, sIdx) in notebook.stacks" :key="stack.id"
           class="flex bg-[#fdfaf3] border-2 border-slate-900 rounded-sm shadow-[4px_4px_0px_black] min-h-[140px]">

        <div class="w-28 border-r-2 border-slate-900 p-3 bg-white/50 flex flex-col distortion-selector-container">
          <p class="text-[7px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Link Card</p>

          <button @click.stop="(e) => toggleSelector(e, sIdx)"
                  class="flex-1 w-full border-2 border-dashed border-slate-300 rounded-sm hover:border-slate-900 hover:bg-white transition-all flex flex-col items-center justify-center p-2 group overflow-hidden">

            <template v-if="stack.linkedPatternId">
              <div class="h-full flex flex-col items-center justify-center">
                <img :src="selectedDistortions.find(p => p.id === stack.linkedPatternId)?.image"
                     class="w-12 h-16 object-cover border border-slate-900 shadow-sm mb-1" />
                <span class="text-[8px] font-black uppercase leading-tight text-slate-900 text-center truncate w-full">
                  {{ selectedDistortions.find(p => p.id === stack.linkedPatternId)?.title }}
                </span>
              </div>
            </template>

            <template v-else>
              <span class="text-xl text-slate-300 group-hover:text-slate-900">+</span>
              <span class="text-[7px] font-black uppercase text-slate-400">Identify</span>
            </template>
          </button>
        </div>

        <div class="flex-1 flex flex-col relative">
          <div class="p-5 flex-1 relative">
            <div class="absolute left-4 top-0 bottom-0 w-[1px] bg-red-200/60"></div>

            <div class="space-y-3 pl-4">
              <div v-for="(text, fIdx) in stack.fragments" :key="fIdx">
                <p class="text-slate-800 text-lg leading-snug font-bold italic" style="font-family: 'Architects Daughter', sans-serif;">
                  "{{ text }}"
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-200 bg-white/40 p-4 pt-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Clinical Observation:</span>
            </div>
            <textarea v-model="stack.notes"
                      placeholder="Add clinical context..."
                      class="w-full bg-transparent text-[14px] text-slate-600 outline-none resize-none min-h-[40px] leading-tight font-medium placeholder:text-slate-300"
                      style="font-family: 'Architects Daughter', sans-serif;"></textarea>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="journal-pop">
        <div v-if="activeSelectorIdx !== null"
             class="journal-popover fixed z-[999] w-72 bg-[#fdfaf3] border-2 border-slate-900 shadow-[8px_8px_0px_black] p-4 flex flex-col"
             :style="{ top: popoverPosition.top + 'px', left: popoverPosition.left + 'px' }">

          <div class="flex justify-between items-center mb-4 border-b-2 border-slate-900 pb-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">Toolkit Link</span>
            <button @click="selectPattern(notebook.stacks[activeSelectorIdx], null)"
                    class="text-[9px] uppercase font-black text-red-600 hover:underline">[ Reset ]</button>
          </div>

          <div class="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
            <button v-for="pattern in selectedDistortions" :key="pattern.id"
                    @click="selectPattern(notebook.stacks[activeSelectorIdx], pattern.id)"
                    class="flex gap-4 p-2 bg-white border border-slate-200 hover:border-slate-900 hover:shadow-[3px_3px_0px_black] transition-all group text-left">
              <img :src="pattern.image" class="w-10 h-14 object-cover border border-slate-900" />
              <div class="flex flex-col justify-center">
                <span class="text-[10px] font-black uppercase text-slate-900 leading-tight mb-0.5">{{ pattern.title }}</span>
                <span class="text-[8px] text-emerald-600 font-bold uppercase tracking-tighter">{{ pattern.clinicalName }}</span>
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

.journal-pop-enter-active, .journal-pop-leave-active { transition: all 0.2s ease-out; }
.journal-pop-enter-from, .journal-pop-leave-to { opacity: 0; transform: translateX(-10px); }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
</style>