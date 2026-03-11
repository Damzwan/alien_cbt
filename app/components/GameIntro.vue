<script setup>
import { storeToRefs } from 'pinia';

const { gameStarted } = storeToRefs(useGameStore())
const currentSlide = ref(0);
const isTransitioning = ref(false);

const slides = [
  {
    image: '/intro/intro1.png',
    title: 'THE VORGATH',
    text: 'The Vorgath are biological masterpieces. We possess three brains, zero tax laws, and can live for centuries. Unfortunately, our primary organ—the Resonance Core—is failing. We are running out of the vibration that keeps our cells from liquefying.',
    btn: 'Deeply inconvenient.'
  },
  {
    image: '/intro/intro2.png',
    title: 'THE DISCOVERY',
    text: 'Scanning sector 7-G led us to Earth. It is populated by "Humans"—bipedal meat-sacks with a fascinating biological defect. They generate massive amounts of "Cognitive Friction" every time they worry about things that haven\'t happened yet.',
    btn: 'Explain the utility.'
  },
  {
    image: '/intro/intro3.png',
    title: 'THE HARVEST',
    text: 'To a human, "Anxiety" is a disorder. To a Vorgath, it is high-grade cellular fuel. By mapping their circular logic loops and irrational fears, we can harvest the resonance needed to stabilize our own failing cores.',
    btn: 'Begin Infiltration.'
  },
  {
    image: '/intro/intro4.png',
    title: 'THE SCAM',
    text: 'We have infiltrated their digital networks as "Therapists." We listen to their mundane traumas, they loop their thoughts into a frenzy, and we siphon the energy. They even pay us for it. It is the most efficient parasitic relationship in the galaxy.',
    btn: 'Initialize Extraction.'
  }
];

const nextSlide = () => {
  if (isTransitioning.value || currentSlide.value >= slides.length) return;

  isTransitioning.value = true;
  // This timing hides the asset swap behind a clean black "blink"
  setTimeout(() => {
    currentSlide.value++;
    isTransitioning.value = false;
  }, 400);
};
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black flex items-center justify-center font-mono text-white select-none overflow-hidden">

    <div
        class="absolute inset-0 z-[100] bg-black transition-opacity duration-300 pointer-events-none"
        :class="isTransitioning ? 'opacity-100' : 'opacity-0'"
    ></div>

    <div v-if="currentSlide < slides.length" class="max-w-2xl w-full p-8">
      <div class="space-y-10">
        <div class="w-full aspect-video bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(0,0,0,1)]">
          <img
              :src="slides[currentSlide].image"
              class="w-full h-full object-cover grayscale contrast-150 transition-transform duration-[2000ms]"
              :class="isTransitioning ? 'scale-110' : 'scale-100'"
          />
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">Intelligence Report</span>
            <span class="h-px flex-1 bg-zinc-900"></span>
          </div>

          <h1 class="text-4xl font-black italic tracking-tighter uppercase text-zinc-100">
            {{ slides[currentSlide].title }}
          </h1>

          <p class="text-zinc-400 text-lg leading-relaxed min-h-[120px]">
            {{ slides[currentSlide].text }}
          </p>
        </div>

        <div class="flex justify-end">
          <button
              @click="nextSlide"
              class="group relative px-10 py-3 bg-white text-black font-black uppercase text-[11px] tracking-widest hover:bg-zinc-200 transition-all overflow-hidden"
          >
            <span class="relative z-10">{{ slides[currentSlide].btn }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center space-y-12">
      <div class="relative group">
        <h1 class="text-9xl font-black italic tracking-tighter leading-none select-none">
          COGNITIVE<br/>
          <span class="text-zinc-800 group-hover:text-white transition-colors duration-700">LINK</span>
        </h1>
        <div class="mt-4 flex items-center justify-center gap-4 text-zinc-700 uppercase tracking-[0.5em] text-[10px] font-black">
          <span>Vorgath Systems</span>
          <span class="w-1 h-1 bg-zinc-800 rounded-full"></span>
          <span>Earth_Sector_01</span>
        </div>
      </div>

      <button
          @click="gameStarted = true"
          class="w-80 h-16 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white font-black uppercase tracking-[0.4em] text-xs transition-all relative overflow-hidden group"
      >
        <div class="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        Begin Extraction
      </button>
    </div>

    <div class="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
  </div>
</template>