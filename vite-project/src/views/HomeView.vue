<template>
  <div>
    <LootboxMenu v-if="weapons && weapons.length != 0" :Skins="weapons" />
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import LootboxMenu from '@/components/LootboxMenu.vue';
import { getSkins } from '@/stores/lootboxes';
import { sessionStore } from '@/stores/session';
import { clientStore } from '@/stores/client';
import { watchLogout } from '@/assets/functions';

const weapons = ref<any> ();  

watch(() => sessionStore().session, (newSession) => watchLogout(newSession));

onMounted(async () => {
  watchLogout(sessionStore().session);
  weapons.value = clientStore().currentWeapons;
  try {
    const skins = await getSkins();
    weapons.value = skins;
    clientStore().currentWeapons = skins;
  } catch (error) {
    console.warn(error);
  }
});

</script>

<style scoped>

div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>