<template>
  <div>
    <div class="title">
      <h1>VALORANT Case Opener</h1>
      <h2>(IS underage gambling *Pls don't sue us*)</h2>
      <h3>"90% of gamblers quit before they hit it big!"</h3>
      <h3>- a really smart dude</h3>
    </div>
  
    <form @submit.prevent="handleLogin" v-if="login">
      <input required type="email" placeholder="Your email" v-model="email" />
      <input required type="text" placeholder="Your password" v-model="password" />
      <input type="submit" :value="loading ? 'Loading' : 'Log in'" :disabled="loading" />
    </form>

    <form @submit.prevent="handleSignup" v-else>
      <input required type="email" placeholder="Your email" v-model="email" />
      <input required type="text" placeholder="Your password" v-model="password" />
      <input type="submit" :value="loading ? 'Loading' : 'Sign up'" :disabled="loading" />
    </form>

  </div>

  <button style="text-decoration: underline; color: white; background-color: transparent; border: 0;" @click="login = !login">
    <h3 v-if="login">Don't have an account? Click to sign up</h3>
    <h3 v-else>Already have an account? Click to log in</h3>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';

const loading = ref<boolean>(false);
const password = ref<string>('');
const email = ref<string>('');
const login = ref<boolean>(true);

const handleLogin = async () => {
  try {
    loading.value = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (error) throw error;

    sessionStore().changeSession({ 
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      token_type: data.session.token_type,
      authenticated: true,
      id: data.user.id,
      email: data.user.email,
     });

  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  } finally {
    loading.value = false;
  }
}

const handleSignup = async () => {
  try {
    loading.value = true;

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    });

    if (error) throw error;

    if (data.session && data.user) {
      sessionStore().changeSession({ 
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        token_type: data.session.token_type,
        authenticated: true,
        id: data.user.id,
        email: data.user.email,
       });
    }

  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style>

.title {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 5em;
  margin-top: 17em;
}

.title h1,
.title h2,
.title h3 {
  margin: 0;
}

</style>
