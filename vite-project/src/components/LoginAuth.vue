<template>
  <form @submit.prevent="handleLogin">
    <input required type="email" placeholder="Your email" v-model="email">
    <input required type="text" placeholder="Your password" v-model="password">
    <input type="submit" :value="loading ? 'Loading' : 'Log in'" :disabled="loading">
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';

const loading = ref<boolean> (false);
const password = ref<string> ("");
const email = ref<string> ("");
const session = sessionStore().session;

const handleLogin = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });
    console.log(data)
    if (error) throw error;
    alert('Logging in...'); 

    session.access_token = data.session.access_token;

    console.log(session)

  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  } finally {
    loading.value = false;
  }
}
</script>
