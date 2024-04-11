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
            <img src="/chest.svg" alt="Click to view your inventory">
            <h3>Inventory</h3>
          </RouterLink>
        </div>
      </div>
    </div>
  </Transition>

  <div class="pityBar">
    <PityBar @response="pity"/>
  </div>

  <div class="chanceMenu">
    <LootboxChances :Skins="filtered" :Current="wheel[2]" :Wheel="wheel"/>
  </div>

  <div class="lootboxMenu">
    <div class="boxDiv">
      <div v-for="skin in wheel" class="loot" :class="{ common: skin.rarity == 'Common', rare: skin.rarity == 'Rare', epic: skin.rarity == 'Epic', legendary : skin.rarity == 'Legendary', godly: skin.rarity == 'Godly' }">
        <img :src="skin.displayIcon" :alt="skin.displayName">
      </div>
    </div>
    <img src="/upArrow.svg" alt="This skin will be drawn" class="arrow">
    <button @click="roll" class="openCrate">
      <img src="/unlock.svg" alt="Click to open the lootbox" class="arrow" :class="{ locked: rolling }">
      <h3 v-if="rolling" class="unlockingText">Opening...</h3>
      <h3 v-else class="unlockText">Open Lootbox</h3>
    </button>
  </div>

</template>

<script setup lang="ts">

// import { supabase } from '@/lib/supabaseClient';
import { ref, onMounted, toRefs } from 'vue';
import LootboxChances from '@/components/LootboxChances.vue';
import PityBar from './PityBar.vue';

type NewWeapon = {
    displayIcon: string;
    displayName: string;
    category: string | null;
    cost: number | null;
    skins: WeaponSkin[];
}

type WeaponSkin = {
    defaultName: string;
    category: string | null;
    displayIcon: string | undefined;
    displayName: string;
    levelsCount: number;
    wallpaper: string | null;
    rarity: string;
}

type Props = {
  Skins: NewWeapon[];
}

const wheel = ref<WeaponSkin[]> ([]);
const outcome = ref<WeaponSkin> ({
  defaultName: "",
  category: null,
  displayIcon: "",
  displayName: "",
  levelsCount: 0,
  wallpaper: "",
  rarity: "",
});
const finished = ref<boolean> (false);
const rolling = ref<boolean> (false);
const filtered = ref<WeaponSkin[]> ([]);
const pitied = ref<boolean> (false);

let rollNumber: number = 0;
const props = defineProps<Props>();

const allSkins: WeaponSkin[][] = props.Skins.map((item: NewWeapon) => item.skins);
const emptyArray: WeaponSkin[] = [];
const combinedSkins: WeaponSkin[] = pitied.value == false ? emptyArray.concat(...allSkins) : emptyArray.concat(...allSkins).filter((skin) => skin.rarity != "Common");
filtered.value = combinedSkins;

function pity (): void {
  pitied.value = true;
}

for (let i = 0; i < 5; i++) {
  const randomSkin: WeaponSkin = combinedSkins[getRandomIntInclusive(0, combinedSkins.length - 1)];
  wheel.value.push(randomSkin);
}

async function roll (): Promise<void> {
  rollNumber = 0;
  const roll: number = getRandomIntInclusive(150, 160);
  rolling.value = true;
  while (rollNumber <= roll) {
    const randomSkin: WeaponSkin = combinedSkins[getRandomIntInclusive(0, combinedSkins.length - 1)];
    wheel.value.push(randomSkin);
    wheel.value.splice(0, 1);

    if (rollNumber < 110) {
      await delay(25);

    } else if (rollNumber < 120) {
      await delay(50);

    } else if (rollNumber < 130) {
      await delay(100);

    } else if (rollNumber < 140) {
      await delay(200);

    } else if (rollNumber < 140 + (2 * Math.round(((roll - 1) - 140)/3))) {
      await delay(300);

    } else if (rollNumber < roll - 1) {
      await delay(650);

    } else if (rollNumber <= roll -1) {
      await delay(1000);
    }

    rollNumber++;
  }

  outcome.value = wheel.value[2];
  await delay(1750);
  finished.value = true;
  rolling.value = false;
  if (pitied.value == true) {
    pitied.value = false;
  }
}

function delay (ms: number) {
  return new Promise((executor: any) => setTimeout(executor, ms));
}

function getRandomIntInclusive(min: number, max: number): number {
  const minCeiled: number = Math.ceil(min);
  const maxFloored: number = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/*const props = defineProps(['session']);
const { session } = toRefs<any> (props);
const loading = ref(true);
const username = ref('');
const website = ref('');
const avatar_url = ref('');

async function getProfile() {
  try {
    loading.value = true;
    const { user } = session.value;

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      username.value = data.username;
      website.value = data.website;
      avatar_url.value = data.avatar_url;
    }
    console.log(username.value, website.value, avatar_url.value)
  } catch (error: any) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
    getProfile();
});*/

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
  margin-top: 5em;
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
  margin-top: 7.5em;
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