<script setup>
import {SESSION_MESSAGES_COUNT} from "~/composables/usePatientSession.ts";

const emit = defineEmits(['goToPage']);
</script>

<template>
  <div class="flex-1 flex flex-col p-12 bg-white">
    <header class="mb-8 border-b-8 border-slate-900 pb-6">
      <h1 class="text-6xl font-black italic tracking-tighter uppercase leading-none">Infiltration Log</h1>
      <div class="flex justify-between items-center mt-2">
        <p class="text-slate-400 font-mono text-xs uppercase tracking-[0.5em]">Mission_Dashboard</p>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-12 flex-1">
      <div class="space-y-4">
        <div class="mb-8 pb-6 border-b border-slate-100">
          <p class="text-sm leading-relaxed text-slate-500 italic">
            You are assigned to stabilize this human specimen within
            <strong>{{ SESSION_COUNT }} sessions</strong>.
            Each session is restricted to
            <strong>{{ SESSION_MESSAGES_COUNT }} messages</strong>.
            Once these limits are reached, the
            <strong>observation period ends</strong>.
            Your objective is to
            <strong>document their cognitive errors</strong> and provide a
            <strong>final recommendation</strong> to determine their viability.
          </p>

        </div>

        <h2 class="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Active Objectives</h2>

        <button @click="emit('goToPage', 1)"
                class="w-full text-left group border-b border-slate-50 pb-3 hover:border-slate-900 transition-all">
          <h3 class="text-[10px] font-black uppercase bg-slate-900 text-white inline-block px-2 mb-1 group-hover:bg-emerald-600">
            01: Diagnostic Codex</h3>
          <p class="text-lg text-slate-700 leading-tight" style="font-family: 'Gloria Hallelujah', cursive;">
            Catalog their specific mental loops.
          </p>
          <p class="text-[8px] font-mono text-slate-400 mt-1 uppercase group-hover:text-slate-900 italic">Open Catalog
            ❯</p>
        </button>

        <button @click="emit('goToPage', 2)"
                class="w-full text-left group border-b border-slate-50 pb-3 hover:border-slate-900 transition-all">
          <h3 class="text-[10px] font-black uppercase bg-slate-900 text-white inline-block px-2 mb-1 group-hover:bg-emerald-600">
            02: Evidence Record</h3>
          <p class="text-lg text-slate-700 leading-tight" style="font-family: 'Gloria Hallelujah', cursive;">
            Pinpoint what they said and why it's wrong.
          </p>
          <p class="text-[8px] font-mono text-slate-400 mt-1 uppercase group-hover:text-slate-900 italic">View Evidence
            ❯</p>
        </button>

        <button @click="emit('goToPage', 3)"
                class="w-full text-left group border-b border-slate-50 pb-3 hover:border-slate-900 transition-all">
          <h3 class="text-[10px] font-black uppercase bg-slate-900 text-white inline-block px-2 mb-1 group-hover:bg-emerald-600">
            03: Final Verdict</h3>
          <p class="text-lg text-slate-700 leading-tight" style="font-family: 'Gloria Hallelujah', cursive;">
            Decide their fate with a summary.
          </p>
          <p class="text-[8px] font-mono text-slate-400 mt-1 uppercase group-hover:text-slate-900 italic">Draft Summary
            ❯</p>
        </button>
      </div>

      <div class="flex flex-col">
        <div class="border-4 border-red-600 p-6 bg-red-50/30 flex-1 flex flex-col justify-center">
          <h3 class="text-red-600 font-black uppercase text-xs mb-4 tracking-widest flex items-center gap-2">
            <span>⚠️</span> Protocol Warning
          </h3>
          <p class="text-xl font-bold text-red-900 leading-tight uppercase tracking-tighter">
            Your final summary determines if this human survives their own brain.
          </p>
          <p class="mt-4 text-sm text-red-700 font-medium border-t border-red-200 pt-4">
            Be precise. If you give bad advice based on poor evidence, their mental state will collapse permanently. We
            don't do refunds.
          </p>
        </div>
      </div>
    </div>

    <footer class="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
      <div class="font-mono text-[9px] text-slate-300 uppercase">
        System_Version: 2.6.0<br>
        Auth_Code: VORGATH_PRIME
      </div>

    </footer>
  </div>
</template>