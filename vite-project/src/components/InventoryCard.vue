<template>
    <div class="itemCardMenu" :class="{ common: item.rarity == 'Common', rare: item.rarity == 'Rare',
    epic: item.rarity == 'Epic', legendary : item.rarity == 'Legendary', godly: item.rarity == 'Godly' }">
        <h1><span style="font-size: var(--p)">{{ item.defaultName }}</span> {{ item.displayName }}</h1>
        <img :src="item.displayIcon" :alt="item.displayName">
        <h3>You have {{ item.inventoryCount }}</h3>
    </div>
</template>

<script setup lang="ts">

import type { WeaponSkin } from '@/assets/types';
import { ref } from 'vue';

type Props = {
    item: WeaponSkin;
}

const props = defineProps<Props> ();

</script>

<style scoped>

.itemCardMenu {
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