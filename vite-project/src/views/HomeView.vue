<template>
  <div>
    <h1>a</h1>
    <LootboxMenu v-if="session" :session="session" />
    <LoginAuth v-else/>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import LoginAuth from '@/components/LoginAuth.vue';
import LootboxMenu from '@/components/LootboxMenu.vue';

const users = ref<any> ();
const loaded = ref<boolean> (false);
const session = ref<any> ();

async function getUsers (): Promise<void> {
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
});

</script>

<style scoped>

</style>