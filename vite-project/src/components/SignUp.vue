<template>
    <form @submit.prevent="handleLogin">
      <input required type="email" placeholder="Your email" v-model="email">
      <input required type="text" placeholder="Your password" v-model="password">
      <input type="submit" :value="loading ? 'Loading' : 'Log in'" :disabled="loading">
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { supabase } from '@/lib/supabaseClient.js';
  
  const loading = ref<boolean> (false);
  const password = ref<string> ("");
  const email = ref<string> ("");
  
  /*const handleLogin = async () => {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      });
      if (error) throw error;
      alert('Logging in...');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading.value = false;
    }
  }*/
  
  async function handleLogin() {
    try {
      // Sign up the user
      const userData = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      });
  
      await supabase
        .from('users')
        .insert({ uuid: userData.data.user.id, email: email.value })
      console.log(userData);
  
    } catch (error) {
      console.error('Sign-up error:', error.message);
    }
  }
  </script>
  