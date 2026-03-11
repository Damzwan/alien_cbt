<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useNotebookStore} from "~/stores/useNotebook.ts";
import JournalManual from "./JournalManual.vue";
import JournalEvidence from "./JournalEvidence.vue";
import JournalSummary from "./JournalSummary.vue";
import JournalCodex from "~/components/JournalCodex.vue";

const notebook = useNotebookStore();
const {nextPage, prevPage, totalPages} = useNotebookStore()
const {currentPage} = storeToRefs(notebook)

// Keyboard Navigation & Escape to Close
const handleKeydown = (e) => {
  if (!notebook.isOpen) return;
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
  if (e.key === 'Escape') notebook.toggle();
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Transition name="fade">
    <div v-if="notebook.isOpen"
         @click.self="notebook.toggle()"
         class="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">

      <div
          class="w-full max-w-7xl h-[92vh] flex bg-[#fdfaf3] border-2 border-slate-300 shadow-2xl overflow-hidden relative rounded-lg"
          @click.stop>

        <div
            class="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/10 to-transparent border-r border-black/5 flex flex-col justify-around py-8 z-30 pointer-events-none">
          <div v-for="n in 14" :key="n"
               class="w-6 h-6 rounded-full bg-[#2c3e50]/20 shadow-inner ml-2 border border-black/10"></div>
        </div>

        <div class="absolute bottom-6 right-8 flex gap-4 z-50 items-center">
          <button @click="prevPage" :disabled="currentPage === 0"
                  class="p-2 bg-slate-200 rounded-full disabled:opacity-10 hover:bg-white transition-all text-slate-800">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span
              class="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded">
               PAGE {{ currentPage + 1 }}/{{ totalPages }}
             </span>
          <button @click="nextPage" :disabled="currentPage === totalPages - 1"
                  class="p-2 bg-slate-200 rounded-full disabled:opacity-10 hover:bg-white transition-all text-slate-800">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 flex flex-col relative pl-10">
          <Transition name="page-flip" mode="out-in">
            <JournalManual
                v-if="currentPage === 0"
                @go-to-page="(p) => currentPage = p"
            />
            <JournalCodex v-else-if="currentPage === 1"/>
            <JournalEvidence v-else-if="currentPage === 2"/>
            <JournalSummary v-else-if="currentPage === 3"/>
          </Transition>
        </div>

        <button @click="notebook.toggle()"
                class="absolute top-6 right-8 z-50 p-2 text-slate-400 hover:text-red-500 transition-colors">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.page-flip-enter-active, .page-flip-leave-active {
  transition: all 0.2s ease;
}

.page-flip-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.page-flip-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>