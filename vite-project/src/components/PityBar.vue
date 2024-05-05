<template>
  <Transition name="helpMenu">
    <div class="helpMenuBackground" v-if="helpMenu">
      <div class="helpMenuDiv">
        <h1 class="helpMenuTitle" :class="{ helpMenuTitleFull: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber)))) == 1 }">Pity Meter</h1>
        <h3>If you open 15 boxes and do not unlock a <span class="legendary">Legendary</span> or <span class="godly">Godly</span>, you are eligible for the pity meter!</h3>
        <div id="progressBarHelp">
          <div class="fillerBar"
          :style="{ width: (Math.min(1, Math.max(0, (boxesSinceLastHelp / pityNumber))) * 100) + '%' }"
          :class="{ full: (Math.min(1, Math.max(0, (boxesSinceLastHelp / pityNumber)))) == 1 }"></div>
        </div>
        <h3>The pity meter will remove all <span class="common">Common</span>, <span class="rare">Rare</span>, and <span class="epic">Epic</span> skins for one spin!</h3>
        <button @click="closeHelpMenu" class="closeHelpMenu">
          <img src="/cancel.svg" alt="Click to close the help menu">
          <h3>Close</h3>
        </button>
      </div>
    </div>
  </Transition>

  <div class="all">
    <button class="help" @click="activateHelpMenu" :class="{ fullButton: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber)))) == 1 }">
      <img src="/questionMark.svg" alt="Click to view information about the pity meter">
    </button>
    <div id="progressBar">
      <div class="fillerBar"
      :style="{ width: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber))) * 100) + '%' }"
      :class="{ full: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber)))) == 1 }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';
import { clientStore } from '@/stores/client';
import { delay } from '@/assets/functions';

const helpMenu = ref<boolean> (false);

const boxesSinceLast = ref<number> (0);
const boxesSinceLastHelp = ref<number> (0);
const pityNumber: number = 15;

watch(() => clientStore().currentPity, (newPity: number) => {
  boxesSinceLast.value = newPity;
});

onMounted(async () => {
  getData();
});

async function activateHelpMenu (): Promise<void> {
  helpMenu.value = true;
  await delay(750);
  boxesSinceLastHelp.value = 15;
}
async function closeHelpMenu (): Promise<void> {
  helpMenu.value = false;
  boxesSinceLastHelp.value = 0;
}

async function getData (): Promise<void> {
    try {
        const { data, error } = await supabase.from('profiles').select()
        if (error) throw error;

        boxesSinceLast.value = data.find((user) => user.id == sessionStore().session.id).boxes_since_last;

    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    }
}

</script>

<style scoped>

.common {
  color: var(--common);
}
.rare {
  color: var(--rare);
}
.epic {
  color: var(--epic);
}
.legendary {
  color: var(--legendary);
}
.godly {
  background-image: var(--godlyText);
  width: fit-content;
  background-clip: text;
  color: transparent;
}

#progressBarHelp {
  width: 80%;
  height: 2.75em;
  background-color: var(--lightContent);
  border-radius: 3em;
  transition: all 0.5s;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.helpMenuBackground {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 999999999;
}

.helpMenuDiv {
  width: fit-content;
  width: 40%;
  height: fit-content;
  min-height: 40%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  border-radius: 5vh;
  padding: 3vh;
  overflow-y: auto;
  color: white;
}
.helpMenuDiv h3 {
  text-align: center;
}

.helpMenuTitle {
  background-image: linear-gradient(to bottom right, #ff9100, #f2a83a, #ff9100);
  width: fit-content;
  background-clip: text;
  color: transparent;
  margin: 0;
}
.helpMenuTitleFull {
  background-image: linear-gradient(to bottom right, #7700ff, #b23af2, #7700ff);
}

.closeHelpMenu {
  background-color: #ff5050;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6em;
  width: 17.5em;
  padding: 1em;
  gap: 5%;
  border-radius: 2em;
  margin-top: 1.5em;
  transition: all 0.5s;
}
.closeHelpMenu h3 {
  font-size: 2.75em;
}
.closeHelpMenu img {
  width: 5em;
  height: 5em;
  transition: all 0.75s;
}

.helpMenu-enter-active, .helpMenu-leave-active {
  transition: all 0.5s ease-in-out;
}

.helpMenu-leave-active {
  transition-delay: 0.15s;
}

.helpMenu-enter-from,
.helpMenu-leave-to {
  opacity: 0;
}

.helpMenu-enter-active .helpMenuDiv,
.helpMenu-leave-active .helpMenuDiv { 
  transition: all 0.25s ease-in-out;
}

.helpMenu-enter-active .helpMenuDiv {
  transition-delay: 0.15s;
}

.helpMenu-enter-from .helpMenuDiv,
.helpMenu-leave-to .helpMenuDiv {
  transform: scale(1.05);
  opacity: 0.001;
}

.all {
  margin-top: 19em;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90em;
  gap: 2em;
}

.help {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6em;
  height: 6em;
  border-radius: 5em;
  border: 0;
  background: linear-gradient(to bottom right, #ff9100, #f2a83a, #ff9100);
  transition: all 0.5s;
}
.help img {
  width: 6em;
  height: 6em;
  transition: all 1s;
}

.fullButton {
  background: linear-gradient(to bottom right, #7700ff, #b23af2, #7700ff);
}

#progressBar {
  width: 80em;
  height: 2.75em;
  background-color: var(--lightContent);
  border-radius: 3em;
  transition: all 0.5s;
}

.fillerBar {
  height: 100%;
  background: linear-gradient(to right, #ff9100, #f2a83a, #ff9100);
  border-radius: 3em;
  transition: all 0.4s ease-in-out;
}

.full {
  background: linear-gradient(to right, #7700ff, #b23af2, #7700ff);
}

@media screen and (max-width: 1200px) {
  .all {
    margin-top: 25em;
  }
  #progressBar {
    width: 70em;
  }
  .helpMenuDiv {
    width: 70%;
  }
}

@media screen and (max-width: 800px) {
  #progressBar {
    width: 30em;
  }
  .helpMenuDiv {
    width: 90%;
    padding: 1vh;
    max-height: 90%;
  }
}

@media (hover: hover) and (pointer: fine) {
.closeHelpMenu:hover {
  transform: scale(1.1);
}
.closeHelpMenu:hover img {
  transform: rotate(360deg);
}
.help:hover {
  transform: scale(1.1);
}
.help:hover img {
  transform: rotate(720deg);
}
}

</style>