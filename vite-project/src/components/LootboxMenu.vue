<template>

  <Transition name="unlock">
    <div v-if="finished" class="unlockBackground">
      <div class="unlockMenu"  :class="{ common: outcome.rarity == 'Common', rare: outcome.rarity == 'Rare', epic: outcome.rarity == 'Epic', legendary : outcome.rarity == 'Legendary', godly: outcome.rarity == 'Godly' }">
        <h1>You unlocked:</h1>
        <img :src="outcome.displayIcon" :alt="outcome.displayName"
        :class="{ unlockImg: outcome.category == 'Pistols' || outcome.category == null, unlockImgBig: outcome.category != 'Pistols' && outcome.category != null }">
        <h2 style="margin-bottom: 0">{{ outcome.displayName }}</h2>
        <h3 style="margin-top: 0">({{ outcome.defaultName }} - {{ outcome.rarity }})</h3>
        <div class="buttonArray">
          <button class="finishedButton nextButton" @click="finished = false">
            <img src="/loop.svg" alt="Click to open another lootbox">
            <h3>Roll Again</h3>
          </button>
          <RouterLink to="/inventory" class="finishedButton inventoryButton">
            <img src="/backpack.svg" alt="Click to view your inventory">
            <h3>Inventory</h3>
          </RouterLink>
        </div>
      </div>
    </div>
  </Transition>

  <div class="pityBar">
    <PityBar />
  </div>

  <div class="chanceMenu">
    <LootboxChances v-if="loadChances" :Skins="filtered" :Current="wheel[2]" :Wheel="wheel"/>
  </div>

  <div class="lootboxMenu">
    <div class="boxDiv">
      <div v-for="skin in wheel" class="loot" :class="{ common: skin.rarity == 'Common', rare: skin.rarity == 'Rare', epic: skin.rarity == 'Epic', legendary : skin.rarity == 'Legendary', godly: skin.rarity == 'Godly' }">
        <img :src="skin.displayIcon" :alt="skin.displayName">
      </div>
    </div>
    <img src="/upArrow.svg" alt="This skin will be drawn" class="arrow">
    <div class="rollButtonArray">
      <button @click="roll" class="openCrate">
        <img src="/unlock.svg" alt="Click to open the lootbox" class="arrow" :class="{ locked: rolling }">
        <h3 v-if="rolling" class="unlockingText">Opening...</h3>
        <h3 v-else class="unlockText">Open Lootbox</h3>
      </button>
      <button @click="spin" class="fastOpen" :class="{ enabledFast: clientStore().fastSpin, disabledFast: rolling }">
        <img src="/fastForward.svg" alt="Click to speed up opening" class="arrow">
        <h3 v-if="rolling">Wait for box...</h3>
        <h3 v-else-if="clientStore().fastSpin">Fast Opening</h3>
        <h3 v-else>Slow Opening</h3>
      </button>
    </div>
  </div>

</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { delay, getRandomIntInclusive } from '@/assets/functions';
import LootboxChances from '@/components/LootboxChances.vue';
import PityBar from './PityBar.vue';
import type { NewWeapon, UserProfile, WeaponSkin } from '@/assets/types';
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';
import { clientStore } from '@/stores/client';

type Props = {
  Skins: NewWeapon[];
};

const props = defineProps<Props>();
const skins = props.Skins;

const wheel = ref<WeaponSkin[]> ([]);
const finished = ref<boolean> (false);
const rolling = ref<boolean> (false);
const filtered = ref<WeaponSkin[]> ([]);
const outcome = ref<WeaponSkin> ({
  defaultName: "",
  category: null,
  displayIcon: "",
  displayName: "",
  levelsCount: 0,
  wallpaper: "",
  rarity: "",
  inventoryCount: 1,
});
const loadChances = ref<boolean> (false);

let rollNumber: number = 0;

const allSkins: WeaponSkin[][] = skins.map((item: NewWeapon) => item.skins);
const emptyArray: WeaponSkin[] = [];
let combinedSkins: WeaponSkin[] = emptyArray.concat(...allSkins);
filtered.value = combinedSkins;

onMounted(async () => {
  loadChances.value = false;
  setWheel();
  loadChances.value = true;

  try {
    const { data, error } = await supabase.from('profiles').select();
    if (error) throw error;
    clientStore().currentPity = data.find((user) => user.id == sessionStore().session.id).boxes_since_last;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
});

watch(() => clientStore().currentPity, (newPity: number) => {
  if (newPity >= 15) {
    combinedSkins = emptyArray.concat(...allSkins).filter((skin) => skin.rarity == "Legendary" || skin.rarity == "Godly");
  } else {
    combinedSkins = emptyArray.concat(...allSkins);
  }
});

function setWheel (): void {
  wheel.value.length = 0;
  for (let i = 0; i < 5; i++) {
    const randomSkin: WeaponSkin = combinedSkins[getRandomIntInclusive(0, combinedSkins.length - 1)];
    wheel.value.push(randomSkin);
  }
}

function spin (): void {
  if (rolling.value == true) {
    return;
  } else {
    clientStore().fastSpin = !clientStore().fastSpin;
  }
}

async function roll (): Promise<void> {
  if (rolling.value == true) {
    return;
  }

  rollNumber = 0;
  const roll: number = getRandomIntInclusive(150, 160);
  rolling.value = true;

  while (rollNumber <= roll) {
    const randomSkin: WeaponSkin = combinedSkins[getRandomIntInclusive(0, combinedSkins.length - 1)];
    wheel.value.push(randomSkin);
    wheel.value.splice(0, 1);

    await rollAnimation(roll);
    
    rollNumber++;
  }
  
  outcome.value = wheel.value[2];
  
  await delay(1000);
  
  await insertData();
  finished.value = true;
  rolling.value = false;
}

async function rollAnimation (roll: number): Promise<void> {
  let roll1 = 25;
  let roll2 = 50;
  let roll3 = 100;
  let roll4 = 200;
  let roll5 = 300;
  let roll6 = 650;
  let roll7 = 1000;

  if (clientStore().fastSpin == true) {
    roll1 = 10;
    roll2 = 20;
    roll3 = 35;
    roll4 = 65;
    roll5 = 90;
    roll6 = 200;
    roll7 = 450;
  }

  if (rollNumber < 110) {
    await delay(roll1);
  
  } else if (rollNumber < 120) {
    await delay(roll2);
  
  } else if (rollNumber < 130) {
    await delay(roll3);
  
  } else if (rollNumber < 140) {
    await delay(roll4);
  
  } else if (rollNumber < 140 + (2 * Math.round(((roll - 1) - 140)/3))) {
    await delay(roll5);
  
  } else if (rollNumber < roll - 1) {
    await delay(roll6);
  
  } else if (rollNumber <= roll - 1) {
    await delay(roll7);
  }

}

async function insertData (): Promise<void> {
  let userProfile: UserProfile = {
    id: sessionStore().session.id,
    boxes_since_last: 0,
  };

  // get boxes_since_last
  try {
    const { data, error } = await supabase.from('profiles').select();
    if (error) throw error;
    userProfile.boxes_since_last = data.find((user) => user.id == sessionStore().session.id).boxes_since_last;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }

  // add item to inventory
  try {
    const { error } = await supabase.from('inventory').insert({
      id: sessionStore().session.id,
      skin_name: outcome.value.displayName,
      date: new Date(),
    });
    const skin = combinedSkins.find((item) => item.displayName == outcome.value.displayName);
    if (skin) {
      clientStore().currentInventory.push(skin);
    }
    if (error) throw error;
  } catch (error: any) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }

  if (!["Legendary", "Godly"].includes(outcome.value.rarity)) {
    userProfile.boxes_since_last++;
  } else {
    userProfile.boxes_since_last = 0;
  }

  // update boxes_since_last
  try {
    const { error } = await supabase.from('profiles').update({
      boxes_since_last: userProfile.boxes_since_last
    }).eq('id', sessionStore().session.id);
    if (error) throw error;
    clientStore().changePity(userProfile.boxes_since_last);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
}

</script>

<style scoped>

.lootboxMenu {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 115em;
  transition: all 0.5s;
}

.boxDiv {
  width: 90em;
  display: flex;
  background-color: rgba(0, 0, 0, 0.25);
  padding: 1em;
  border-radius: 2em;
  align-items: center;
  height: 15em;
}

.loot {
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loot img {
  max-width: 95%;
  max-height: 95%;
}

.arrow {
  width: 7.5em;
  height: 7.5em;
}

.rollButtonArray {
  display: flex;
  width: 50%;
  margin-top: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4em;
}

.fastOpen {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2em;
  background-color: #ff5050;
  border-width: 0.2em;
  border-radius: 2.5em;
  transition: all 0.5s;
  width: 18em;
  overflow: hidden;
}
.fastOpen h3 {
  position: absolute;
  display: none;
  margin: 0;
}
.fastOpen img {
  transition: all 0.5s;
}

.fastOpen:hover h3 {
  display: block;
}
.fastOpen:hover img {
  transform: translateX(15em);
}

.enabledFast {
  background-color: var(--deepGreen);
}
.enabledFast h3 {
  display: block;
}
.enabledFast img {
  transform: translateX(15em);
}

.disabledFast {
  background-color: var(--darkGray);
}

.openCrate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2em;
  background: var(--godly);
  border-width: 0.2em;
  border-radius: 2.5em;
  transition: all 0.5s;
  width: 18em;
  overflow: hidden;
}
.openCrate .unlockText {
  position: absolute;
  display: none;
  margin: 0;
}
.openCrate img {
  transition: all 0.5s;
}

.openCrate:hover .unlockText {
  display: block;
}
.openCrate:hover img {
  transform: translateY(10em);
}

.unlockingText {
  position: absolute;
  margin: 0;
}
.locked {
  transform: translateY(10em);
}

.common {
  background-color: var(--common);
}
.rare {
  background-color: var(--rare);
}
.epic {
  background-color: var(--epic);
}
.legendary {
  background-color: var(--legendary);
}
.godly {
  background: var(--godly);
}

.unlockBackground {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  overflow: hidden;
  z-index: 99999999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.unlockMenu {
  min-width: 75em;
  max-width: 125em;
  padding: 20px;
  border-radius: 3vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 80%;
  min-height: 30%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
}

.unlockImg {
  max-width: 40%;
}
.unlockImgBig {
  max-width: 90%;
  min-width: 70%;
}

.unlock-enter-active, .unlock-leave-active {
  transition: all 0.5s ease-in-out;
}

.unlock-leave-active {
  transition-delay: 0.15s;
}

.unlock-enter-from,
.unlock-leave-to {
  opacity: 0;
}

.unlock-enter-active .unlockMenu,
.unlock-leave-active .unlockMenu { 
  transition: all 0.25s ease-in-out;
}

.unlock-enter-active .unlockMenu {
  transition-delay: 0.15s;
}

.unlock-enter-from .unlockMenu,
.unlock-leave-to .unlockMenu {
  transform: scale(1.05);
  opacity: 0.001;
}

.chanceMenu {
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;
  border-radius: 3em;
  padding: 1em;
  gap: 1.5em;
  transition: all 0.5s;
  margin-top: 3em;
  margin-bottom: 2.5em;
}

.buttonArray {
  display: flex;
  justify-content: space-evenly;
  width: 75%;
  margin-top: 1em;
}

.finishedButton {
  width: 50%;
  font-size: var(--p);
  height: 6.5em;
  border-radius: 1.5em;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10%;
  filter: grayscale(0.33);
  border: solid;
  border-width: 0.1em;
  text-decoration: none;
}

.nextButton {background-color: var(--deepYellow)}
.inventoryButton {background-color: #50dcff}

.finishedButton h3 {
  margin: 0;
  text-align: center;
  width: fit-content;
  height: fit-content;
  font-size: var(--h3);
}

.finishedButton img {
  background-color: transparent;
}

.finishedButton > * {
  width: 5vh;
  height: 5vh;
  margin-right: 0;
}

.finishedButton:hover {
  filter: grayscale(0);
}

</style>