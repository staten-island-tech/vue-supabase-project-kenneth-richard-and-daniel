<template>
  <div>
    <LootboxMenu v-if="weapons && session && session.access_token != ''" :Skins="weapons" />
    <LoginAuth v-else/>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import LoginAuth from '@/components/LoginAuth.vue';
import LootboxMenu from '@/components/LootboxMenu.vue';
import { getSkins } from '@/stores/lootboxes';
import { sessionStore } from '@/stores/session';

const session = ref<any> ();
const weapons = ref<any> ();  

watch(() => sessionStore().session, (newSession) => {
  session.value = newSession;
});

onMounted(async () => {
  session.value = sessionStore().session;
  try {
    weapons.value = await getSkins();
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