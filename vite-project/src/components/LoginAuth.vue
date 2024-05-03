<template>
  <div>
    <div class="title">
      <h1>VALORANT Case Opener</h1>
      <h2>(IS underage gambling *Pls don't sue us*)</h2>
      <h3>"90% of gamblers quit before they hit it big!"</h3>
      <h3>- a really smart dude</h3>
      <h3>"90% of gamblers quit before they hit it big!"</h3>
      <h3>- a really smart dude</h3>
    </div>
  
    <form @submit.prevent="handleLogin" v-if="login">
      <input class="log" required type="email" placeholder="Your email" v-model="email" />
      <input class="logpass" required type="password" placeholder="Your password" v-model="password" />
      <input class="loginbutt" type="submit" :value="loading ? 'Loading' : 'Log in'" :disabled="loading" />
    </form>

    <form @submit.prevent="handleSignup" v-else>
      <input class="sign" required type="email" placeholder="Your email" v-model="email" />
      <input class="signpass" required type="password" placeholder="Your password" v-model="password" />
      <input class="signupbutt" type="submit" :value="loading ? 'Loading' : 'Sign up'" :disabled="loading" />
    </form>

  </div>

  <button style="text-decoration: underline; color: white; background-color: transparent; border: 0;" @click="login = !login">
    <h3 class = "signhov" v-if="login">Don't have an account? Click to sign up</h3>
    <h3 class = "loghov" v-else>Already have an account? Click to log in</h3>
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

async function handleLogin () {
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

async function handleSignup () {
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

.loginbutt {
  text-decoration: none;
  font-size: var(--h2);
  width: 8em;
  height: 1.5em;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  overflow: hidden;
  transition: all 0.5s;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loginbutt:hover {
  background-color: var(--lightBlue);
}

.signupbutt {
  text-decoration: none;
  font-size: var(--h2);
  width: 8em;
  height: 1.5em;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  transition: all 0.5s;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signupbutt:hover {
  background-color: var(--pastelGreen);
  align-self: center;
}

.loghov:hover, .signhov:hover {
  background-color: var(--blue);
  align-self: center;
}

.log, .sign {
  padding: 10px; 
  border: none; 
  margin: 1em;
}

.logpass, .signpass {
  padding: 10px; 
  border: none;
  margin: 1em;
}

.log:active, .sign:active, .logpass:active, .signpass:active{
  background-color: var(--lightBlue); 
}


</style>
