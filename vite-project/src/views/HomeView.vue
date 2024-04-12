<template>
  <div>
    <!--<LootboxChances v-if="weapons" :Skins="weapons" />-->
    <LootboxMenu v-if="weapons && session" :Skins="weapons" />
    <LoginAuth v-else/>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, toRefs } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';
import LoginAuth from '@/components/LoginAuth.vue';
import LootboxMenu from '@/components/LootboxMenu.vue';
import { getSkins } from '@/stores/lootboxes';
import LootboxChances from '@/components/LootboxChances.vue';

const users = ref<any> ();
const loaded = ref<boolean> (false);
const session = ref<any> ();

const weapons = ref<any> ();
  
onMounted(async () => {
    try {
        weapons.value = await getSkins();
    } catch (error) {
        console.warn(error);
    }
});

/*async function getUsers (): Promise<void> {
  const userTable = await supabase.from('users').select();
  users.value = userTable.data;
  console.log(userTable)
}

onMounted(() => {
  getUsers();
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
});*/

</script>

<style scoped>

div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>