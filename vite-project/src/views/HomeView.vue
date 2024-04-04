<template>
  <div>
    <h1>a</h1>
    <LoginAuth/>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import LoginAuth from '@/components/LoginAuth.vue';

const users = ref<any> ();
const loaded = ref<boolean> (false);

async function getUsers (): Promise<void> {
  const userTable = await supabase.from('users').select();
  users.value = userTable.data;
  console.log(userTable)
}

onMounted(() => {
  getUsers();
});

</script>

<style scoped>

</style>