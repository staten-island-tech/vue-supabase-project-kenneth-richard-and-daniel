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
    <img src="/upArrow.svg" alt="This skin will be drawn." class="arrow">
    <button @click="roll">Open Lootbox</button>
  </div>
</template>

<script setup lang="ts">

// import { supabase } from '@/lib/supabaseClient';
import { ref, onMounted, toRefs } from 'vue';

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
      await delay(250);

    } else if (rollNumber < 146) {
      await delay(500);

    } else if (rollNumber <= 150) {
      await delay(1000);
    }

    rollNumber++;
  }

  outcome.value = wheel.value[2];
  await delay(2000);
  finished.value = true;
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

.common {
  background-color: #60d149;
}
.rare {
  background-color: #52b1ff;
}
.epic {
  background-color: #c174ff;
}
.legendary {
  background-color: #f3ff52;
}
.godly {
  background: linear-gradient(to bottom right, #ff0000, #ffbb00, #bbff00, #00ff4c, #00c3ff, #ff00ff);
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

</style>