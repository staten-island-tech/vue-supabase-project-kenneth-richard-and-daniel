<template>
    <div>

    </div>
</template>

<script setup lang="ts">

import { supabase } from '@/lib/supabaseClient';
import { ref, onMounted, toRefs } from 'vue';

const props = defineProps(['session']);
const { session } = toRefs<any> (props);
const loading = ref(true);
const username = ref('');
const website = ref('');
const avatar_url = ref('');

async function getProfile() {
  try {
    loading.value = true;
    const { user } = session.value;

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      username.value = data.username;
      website.value = data.website;
      avatar_url.value = data.avatar_url;
    }
    console.log(username.value, website.value, avatar_url.value)
  } catch (error: any) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
    getProfile();
});

</script>

<style scoped>

</style>