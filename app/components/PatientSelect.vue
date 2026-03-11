<script setup>

import {all_characters} from "~/config/characters/characters.ts";

const emit = defineEmits(['select']);
const character_keys = Object.keys(all_characters)
const character_values = Object.values(all_characters)
</script>

<template>
  <div class="fixed inset-0 bg-black flex flex-col p-12 font-mono text-white z-40 select-none">

    <header class="mb-20 border-b border-zinc-900 pb-10 flex justify-between items-end">
      <div class="space-y-1">
        <h1 class="text-5xl font-black italic tracking-tighter uppercase">Pick a person</h1>
        <p class="text-zinc-700 text-xs uppercase tracking-[0.3em]">Who are we "helping" today?</p>
      </div>
      <div class="text-right text-[10px] text-zinc-600 uppercase font-bold">
        <p>Energy levels: low</p>
        <p>Patience: lower</p>
      </div>
    </header>

    <div class="flex-1 flex gap-16 justify-center items-center">
      <div
          v-for="(char, i) in character_values"
          :key="char.name"
          @click="emit('select', character_keys[i])"
          class="w-[350px] cursor-pointer group"
      >
        <div
            class=" bg-zinc-950 border border-zinc-900 group-hover:border-white transition-all duration-500 overflow-hidden mb-8 relative grayscale">
          <img
              :src="`/character_profiles/${char.name.toLowerCase()}.png`"
              class="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          <div class="absolute bottom-4 left-4">
            <h3 class="text-3xl font-black uppercase italic tracking-tighter">{{ char.name }}</h3>
          </div>
        </div>

        <div class="space-y-6">
          <p class="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-300 transition-colors">
            {{ char.description }}
          </p>

          <button
              class="w-full py-4 border border-zinc-800 text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
            Start Session
          </button>
        </div>
      </div>
    </div>

    <div
        class="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
  </div>
</template>