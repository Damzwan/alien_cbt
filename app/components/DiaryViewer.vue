<script setup>
import {useGameStore} from "~/stores/useGame.ts";

const props = defineProps({
  session: Number
})

const store = useGameStore();

const closeDiary = () => {
  store.isDiaryOpen = false;
};

</script>

<template>
  <Transition name="diary-pop">
    <div v-if="store.isDiaryOpen"
         class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl"
         @click.self="closeDiary">

      <div
          class="w-full max-w-5xl bg-[#f4f1ea] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm rotate-1 flex flex-col md:flex-row relative text-slate-800 font-serif">

        <div class="absolute left-4 top-0 bottom-0 flex flex-col justify-around py-4">
          <div v-for="i in 12" :key="i" class="w-4 h-4 rounded-full bg-slate-950/20 shadow-inner"></div>
        </div>

        <div class="flex-1 p-10 border-r border-slate-300 ml-8">
          <h1 class="text-3xl font-bold mb-6 text-slate-900 underline decoration-slate-300 underline-offset-8 italic">
            Diary - Week {{ session || '?' }}
          </h1>

          <div class="space-y-8">
            <div v-for="ev in store.previousDiary?.events" :key="ev.id"
                 class="relative pl-6 border-l-2 border-slate-200">
              <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full"
                   :class="ev.outcome === 'success' ? 'bg-emerald-500' : ev.outcome === 'failure' ? 'bg-red-500' : 'bg-amber-500'">
              </div>
              <h3 class="font-bold text-lg uppercase tracking-tight text-slate-700 leading-tight">{{ ev.title }}</h3>
              <p class="text-slate-600 leading-relaxed mt-1 italic leading-snug">"{{ ev.narrative }}"</p>
            </div>
          </div>
        </div>

        <div class="flex-1 p-10 bg-white/50 flex flex-col">
          <h2 class="text-2xl font-bold mb-4 text-slate-400 uppercase tracking-widest font-mono">Internal Leakage</h2>
          <div class="mb-8 relative">
            <span class="absolute -top-3 -left-2 text-4xl text-slate-200 font-serif">“</span>
            <p class="text-xl text-slate-700 leading-relaxed italic border-b border-dashed border-slate-300 pb-6">
              {{ store.previousDiary?.journal_entry }}
            </p>
          </div>

          <div class="flex-1">
            <p class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Subconscious Tags:</p>
            <div class="flex flex-wrap gap-2">
              <div v-for="feeling in store.previousDiary?.key_feelings" :key="feeling"
                   class="bg-blue-100/60 px-3 py-1.5 rounded-sm border-b border-blue-300 text-blue-900 text-xs font-bold uppercase tracking-tighter">
                {{ feeling }}
              </div>
            </div>
          </div>

          <div class="mt-8 text-right">
            <button @click="closeDiary"
                    class="bg-slate-900 text-white px-8 py-3 font-mono uppercase font-black hover:bg-emerald-700 transition-all shadow-lg">
              Close Diary
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.diary-pop-enter-active, .diary-pop-leave-active {
  transition: all 0.4s ease;
}

.diary-pop-enter-from, .diary-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>