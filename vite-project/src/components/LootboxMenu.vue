<template>
  <button @click="roll">Click</button>
  <div v-for="skin in wheel" style="display: flex; gap: 5vw">
    <img :src="skin.displayIcon" alt="" style="height: 25%; width: 25%;"
    :class="{ common: skin.rarity == 'Common', rare: skin.rarity == 'Rare', epic: skin.rarity == 'Epic', legendary : skin.rarity == 'Legendary', godly: skin.rarity == 'Godly' }">
    <h3>{{ skin.displayName }}</h3>
  </div>

  <div v-if="finished" style="background-color: black; color: white; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <h3>you got</h3>
    <img :src="outcome.displayIcon" alt="" style="height: 25%; width: 25%;">
    <h1>{{ outcome.displayName }}</h1>
    <button @click="finished = false">Close</button>
  </div>
</template>

<script setup lang="ts">

// import { supabase } from '@/lib/supabaseClient';
import { ref, onMounted, toRefs } from 'vue';

type WeaponSkin = {
    displayIcon: string | null;
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

</style>