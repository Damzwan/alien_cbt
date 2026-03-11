<script setup>
const props = defineProps({
  phase: String, // 'active', 'reviewing', 'done', 'final_review'
  review: Object,
  onNext: Function,
  sessionNumber: Number,
  finalReview: Object, // The { epilogue, clinical_critique } object
});


</script>

<template>
  <Transition name="diary-pop">
    <div v-if="phase !== 'active'"
         class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl">

      <div v-if="phase === 'reviewing'" class="text-center font-mono">
        <div class="relative w-24 h-24 mx-auto mb-4">
          <div class="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
          <div
              class="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-emerald-400 uppercase tracking-[0.2em] animate-pulse text-sm font-black">
          Peeking into diary using alien powers...
        </p>
      </div>

      <div v-else-if="phase === 'final_reviewing'" class="text-center font-mono">
        <div class="relative w-24 h-24 mx-auto mb-4">
          <div class="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
          <div
              class="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-emerald-400 uppercase tracking-[0.2em] animate-pulse text-sm font-black">
          Synthesizing Final Clinical Outcomes...
        </p>
      </div>

      <div v-else-if="phase === 'done' && review"
           class="w-full max-w-5xl bg-[#f4f1ea] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm rotate-1 flex flex-col md:flex-row relative text-slate-800 font-serif">
        <div class="absolute left-4 top-0 bottom-0 flex flex-col justify-around py-4">
          <div v-for="i in 12" :key="i" class="w-4 h-4 rounded-full bg-slate-950/20 shadow-inner"></div>
        </div>

        <div class="flex-1 p-10 border-r border-slate-300 ml-8">
          <h1 class="text-3xl font-bold mb-6 text-slate-900 underline decoration-slate-300 underline-offset-8 italic">
            Diary - Week {{ sessionNumber }}
          </h1>

          <div class="space-y-8">
            <div v-for="ev in review.events" :key="ev.id" class="relative pl-6 border-l-2 border-slate-200">
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
              {{ review.journal_entry }}
            </p>
          </div>
          <div class="flex-1">
            <p class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Subconscious Tags:</p>
            <div class="flex flex-wrap gap-2">
              <div v-for="feeling in review.key_feelings" :key="feeling"
                   class="bg-blue-100/60 px-3 py-1.5 rounded-sm border-b border-blue-300 text-blue-900 text-xs font-bold uppercase tracking-tighter">
                {{ feeling }}
              </div>
            </div>
          </div>
          <div class="mt-8 text-right">
            <button @click="onNext"
                    class="bg-slate-900 text-white px-8 py-3 font-mono uppercase font-black hover:bg-emerald-700 transition-all shadow-lg">
              Next Session →
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="phase === 'final_review' && finalReview"
           class="w-full max-w-6xl max-h-[85vh] bg-[#fdfaf3] shadow-[20px_20px_0px_rgba(0,0,0,0.2)] border-2 border-slate-800 flex flex-col md:flex-row relative overflow-hidden">

        <div
            class="flex-[1.2] p-8 md:p-12 relative border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar">
          <div class="mb-6">
            <span
                class="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-[0.3em]">Patient Epilogue</span>
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mt-2 font-mono">
              {{ finalReview.epilogue.title }}
            </h1>
          </div>

          <div class="prose prose-slate max-w-none">
            <p class="text-lg md:text-xl text-slate-800 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left"
               style="font-family: 'Gloria Hallelujah', cursive; white-space: pre-wrap;">
              {{ finalReview.epilogue.story }}
            </p>
          </div>
        </div>

        <div
            class="flex-1 p-8 bg-slate-50 flex flex-col relative overflow-y-auto border-t md:border-t-0 border-slate-200">

          <div class="absolute top-4 right-4 flex gap-2">
            <div
                class="rotate-3 border-2 border-emerald-500/30 p-2 rounded-lg flex flex-col items-center justify-center min-w-[70px] bg-white/50 backdrop-blur-sm">
              <span class="text-[8px] font-mono font-bold text-emerald-600 uppercase">Analysis</span>
              <span class="text-xl font-black text-emerald-600 font-mono">{{
                  finalReview.clinical_critique.mapping_accuracy
                }}%</span>
            </div>
            <div
                class="rotate-3 border-2 border-blue-500/30 p-2 rounded-lg flex flex-col items-center justify-center min-w-[70px] bg-white/50 backdrop-blur-sm">
              <span class="text-[8px] font-mono font-bold text-blue-600 uppercase">Impact</span>
              <span class="text-xl font-black text-blue-600 font-mono">{{
                  finalReview.clinical_critique.therapeutic_effectiveness
                }}%</span>
            </div>
          </div>

          <h2 class="text-lg font-black text-slate-400 uppercase tracking-widest font-mono mb-6 border-b border-slate-200 pb-2">
            Supervisor's Audit
          </h2>

          <div class="mb-6 p-4 bg-white border border-slate-200 shadow-sm">
            <p class="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">Supervisor's Note</p>
            <p class="text-sm text-slate-700 italic leading-relaxed">
              "{{ finalReview.clinical_critique.performance_summary }}"
            </p>
          </div>

          <div class="space-y-6">
            <section>
              <p class="text-[10px] font-mono font-black text-emerald-600 uppercase mb-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Strengths
              </p>
              <ul class="space-y-1.5">
                <li v-for="str in finalReview.clinical_critique.strengths" :key="str"
                    class="text-xs text-slate-700 pl-4 border-l-2 border-emerald-500/20 italic">
                  {{ str }}
                </li>
              </ul>
            </section>

            <section>
              <p class="text-[10px] font-mono font-black text-red-600 uppercase mb-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Blind Spots
              </p>
              <ul class="space-y-1.5">
                <li v-for="blind in finalReview.clinical_critique.blind_spots" :key="blind"
                    class="text-xs text-slate-700 pl-4 border-l-2 border-red-500/20 italic">
                  {{ blind }}
                </li>
              </ul>
            </section>
          </div>

          <div class="mt-auto pt-8">
            <div class="bg-slate-900 p-5 text-white rounded-sm shadow-xl">
              <p class="text-[9px] font-mono text-slate-400 uppercase mb-1">Final Verdict</p>
              <p class="text-[11px] font-mono leading-tight mb-4 italic opacity-80">
                "Intervention concluded. Prognosis locked."
              </p>
              <button @click="onNext"
                      class="w-full py-3 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                Close Clinical Record
              </button>
            </div>
          </div>
        </div>

        <div
            class="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.diary-pop-enter-active {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.diary-pop-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-2deg);
}

/* Custom prose tweak for the story */
.prose p {
  margin-bottom: 2rem;
}
</style>