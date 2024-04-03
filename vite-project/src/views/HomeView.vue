<template>
  <div>
    <li v-for=""></li>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';

const users: any = ref([]);
const loaded: object = ref(false);

async function getUsers () {
  const { data } = await supabase.from('users').select();
  users.value = data;
}

onMounted(() => {
  getUsers();
});

</script>

<style scoped>

</style>