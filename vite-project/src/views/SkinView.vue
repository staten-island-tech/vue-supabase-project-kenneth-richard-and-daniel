<template>
    <div v-for="weapon in weapons">
      <div v-for="skin in weapon.skins">
        <img :src="skin.displayIcon" alt=""
        :class="{ common: skin.rarity == 'Common', rare: skin.rarity == 'Rare', epic: skin.rarity == 'Epic', legendary : skin.rarity == 'Legendary', godly: skin.rarity == 'Godly' }">
        <h3>{{ skin.displayName }}</h3>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
  
import { ref, onMounted, toRefs } from 'vue';
import { getSkins } from '@/stores/lootboxes';
  
const weapons = ref<any> ();
  
onMounted(async () => {
    try {
        weapons.value = await getSkins();
    } catch (error) {
        console.warn(error);
    }
});

  
</script>
  
<style scoped>

.common {
  background-color: #66ff52;
}
.rare {
  background-color: #52b1ff;
}
.epic {
  background-color: #cf67ff;
}
.legendary {
  background-color: #f3ff52;
}
.godly {
  background-color: #ff389c;
}
  
</style>