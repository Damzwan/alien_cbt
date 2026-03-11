<script setup>
import {useNotebookStore} from "~/stores/useNotebook.ts";

const notebook = useNotebookStore();
</script>

<template>
  <div class="flex-1 flex flex-col p-12 bg-white">
    <header class="mb-8 border-b-2 border-slate-900 pb-4">
      <h2 class="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Clinical Synthesis</h2>
      <p class="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-1">
        Final Analysis // Case Closing Recommendation
      </p>
    </header>

    <div class="flex-1 flex flex-col">
      <div class="mb-4 flex justify-between items-baseline">
        <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest">Formal Recommendation</label>
        <span class="text-[10px] italic text-slate-400 uppercase">Input will be synthesized into the subject's neural exit-state</span>
      </div>

      <div class="flex-1 bg-[#fdfaf3] border-2 border-slate-900 rounded-sm relative shadow-md overflow-hidden">

        <div class="absolute left-12 top-0 bottom-0 w-[1px] bg-red-200 z-0"></div>

        <div class="absolute inset-0 pointer-events-none opacity-[0.4]"
             style="background-image: linear-gradient(#cbd5e1 1px, transparent 1px); background-size: 100% 2.5rem; background-position: 0 3.2rem;">
        </div>

        <textarea v-model="notebook.recommendations"
                  placeholder="In my clinical opinion, the subject requires..."
                  class="w-full h-full bg-transparent text-slate-800 outline-none resize-none relative z-10 px-16 font-bold"
                  style="
                    font-family: 'Architects Daughter', sans-serif;
                    font-size: 1.25rem;
                    line-height: 2.5rem;
                    padding-top: 1rem;
                  "></textarea>
      </div>


    </div>
  </div>
</template>

<style scoped>
/* Added a cleaner handwritten font for better legibility than Gloria Hallelujah */
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

/* Internal scrollbar for the textarea */
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>