<template>
  <div>
    <LootboxMenu v-if="weapons && weapons.length != 0 && session && session.access_token != ''" :Skins="weapons" />
    <LoginAuth v-else/>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import LoginAuth from '@/components/LoginAuth.vue';
import LootboxMenu from '@/components/LootboxMenu.vue';
import { getSkins } from '@/stores/lootboxes';
import { sessionStore } from '@/stores/session';
import { clientStore } from '@/stores/client';

const session = ref<any> ();
const weapons = ref<any> ();  

watch(() => sessionStore().session, (newSession) => {
  session.value = newSession;
});

onMounted(async () => {
  session.value = sessionStore().session;
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