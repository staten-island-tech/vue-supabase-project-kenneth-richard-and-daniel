<template>
    <div v-for="weapon in weapons">
      <div v-for="skin in weapon.skins">
        <h3>{{ skin.displayName }}</h3>
        <img :src="skin.displayIcon" alt=""
        :class="{ common: skin.rarity == 'Common', rare: skin.rarity == 'Rare', epic: skin.rarity == 'Epic', legendary : skin.rarity == 'Legendary', godly: skin.rarity == 'Godly' }">
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
  
</style>