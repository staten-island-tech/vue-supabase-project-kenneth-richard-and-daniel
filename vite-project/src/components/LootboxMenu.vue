<template>
  <Transition name="unlock">
    <div v-if="finished" class="unlockBackground">
      <div class="unlockMenu"  :class="{ common: outcome.rarity == 'Common', rare: outcome.rarity == 'Rare', epic: outcome.rarity == 'Epic', legendary : outcome.rarity == 'Legendary', godly: outcome.rarity == 'Godly' }">
        <h1>You unlocked:</h1>
        <img :src="outcome.displayIcon" :alt="outcome.displayName" class="unlockImg">
        <h2>{{ outcome.displayName }}</h2>
        <button @click="finished = false">Close</button>
      </div>
    </div>
  </Transition>

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

  <Transition name="chances">
    <div class="chanceMenu" v-if="rolling">
      <LootboxChances :Skins="props.Skins" :Current="wheel[2]"/>
    </div>
  </Transition>
</template>

<script setup lang="ts">

// import { supabase } from '@/lib/supabaseClient';
import { ref, onMounted, toRefs } from 'vue';
import LootboxChances from '@/components/LootboxChances.vue';

type WeaponSkin = {
    displayIcon: string | undefined;
    displayName: string;
    levelsCount: number;
    wallpaper: string | null;
    rarity: string;
}

const wheel = ref<WeaponSkin[]> ([]);
const outcome = ref<WeaponSkin> ({
  displayIcon: "",
  displayName: "",
  levelsCount: 0,
  wallpaper: "",
  rarity: "",
});
const finished = ref<boolean> (false);
const rolling = ref<boolean> (false);
let rollNumber: number = 0;

const props = defineProps({
  Skins: Array,
});

// console.log(props.Skins)

const allSkins: any = props.Skins?.map((item: any) => item.skins);
// console.log(allSkins)
const combinedSkins: WeaponSkin[] = [].concat(...allSkins);

// console.log(combinedSkins)

for (let i = 0; i < 5; i++) {
  const randomSkin: WeaponSkin = combinedSkins[getRandomIntInclusive(0, combinedSkins.length - 1)];
  wheel.value.push(randomSkin);
}

// console.log(wheel.value)

async function roll () {
  rollNumber = 0;
  rolling.value = true;
  while (rollNumber <= 150) {
    // console.log(rollNumber);
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

    } else if (rollNumber < 146) {
      await delay(350);

    } else if (rollNumber < 149) {
      await delay(750);

    } else if (rollNumber <= 149) {
      await delay(1250);
    }

    rollNumber++;
  }

  outcome.value = wheel.value[2];
  await delay(2000);
  finished.value = true;
  rolling.value = false;
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
  margin-top: 7.5em;
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
  max-height: 40%;
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
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;
}

.chances-enter-active, .chances-leave-active {
  transition: all 0.5s ease-in-out;
}

.chances-leave-active {
  transition-delay: 0.15s;
}

.chances-enter-from,
.chances-leave-to {
  opacity: 0;
}

.chances-enter-active .chanceMenu,
.chances-leave-active .chanceMenu { 
  transition: all 0.25s ease-in-out;
}

.chances-enter-active .chanceMenu {
  transition-delay: 0.15s;
}

.chances-enter-from .chanceMenu,
.chances-leave-to .chanceMenu {
  transform: translateY(30px);
  opacity: 0.001;
}

</style>