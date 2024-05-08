<template>
  <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
    <div class="titleDiv">
      <div class="titleBorder">
        <div class="titleBackground">
          <img src="/valorant.svg" alt="VALORANT Case Opener">
          <div class="title">
            <h1>VALORANT Case Opener</h1>
            <h3>(NOT underage gambling)</h3>
            <p>Created by Kenneth Ng, Richard Li, & Daniel Lin</p>
          </div>
        </div>
      </div>
    </div>
  
    <div class="logins">
      <form @submit.prevent="handleAuth(login ? 'login' : 'signup')">
        <input class="email" required type="email" placeholder="Email" v-model="email" />
        <input class="password" required type="password" placeholder="Password" v-model="password" />
        <input class="submit" type="submit" :value="login ? 'Log in' : 'Sign up'" />
      </form>
    </div>

    <button class="switch" @click="login = !login">
      <h3 v-if="login">Don't have an account? Click to sign up</h3>
      <h3 v-else>Already have an account? Click to log in</h3>
    </button>

    <div class="quoteBackground">
      <div class="quote">
        <h3 class="quoteTitle">"{{ randomQuote }}"</h3>
        <h3>- Sun Tzu, <span style="font-style: italic;">The Art of War</span></h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';
import { getRandomIntInclusive } from '@/assets/functions';
import router from '@/router';
import { clientStore } from '@/stores/client';

const quotes = ["90% of gamblers quit before they hit it big!", "There are only two types of people in this world: winners and quitters!",
  "The less you open, the more you can't win!", "You lose 100% of the lootboxes you don't open!"
];
const randomQuote = quotes[getRandomIntInclusive(0, quotes.length - 1)];

const password = ref<string>("");
const email = ref<string>("");
const login = ref<boolean>(true);

async function loginOrSignup (type: "login" | "signup") {
  try {
    
    if (type == "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      });
      if (error) throw error;
      return data;

    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      });
      if (error) throw error;
      return data;
    }

  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
}

async function handleAuth (type: "login" | "signup"): Promise<void> {
  const data = await loginOrSignup(type);
  
  if (data && data.user && data.session) {
    sessionStore().changeSession({ 
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      token_type: data.session.token_type,
      authenticated: true,
      id: data.user.id,
      email: data.user.email,
      newPlayer: type == "signup" ? true : false
     });
    
     const intendedRoute = clientStore().intendedRoute;
    if (intendedRoute != "" && type == "login") {
      router.push(intendedRoute);
    } else {
      router.push("/lootbox");
    }
  }
}
</script>

<style>

.loginPage {
  height: 100vh;
}

.titleDiv {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 5em;
  margin-top: 5em;
}

.titleDiv h1,
.titleDiv h2,
.titleDiv h3 {
  margin: 0;
}

.titleBorder, .titleBackground, .title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.titleBorder, .titleBackground {
  border-radius: 5em;
  padding: 2em;
}

.titleBackground {
  flex-direction: row;
  gap: 3.5em;
}
.titleBackground img {
  width: 20%;
  height: 20%;
}

.titleBorder {
  background: linear-gradient(to bottom, #ff5152, #db0000);
  padding: 0.5em;
}

.titleBackground {
  background-color: #0c1824;
}
.title {
  background-image: linear-gradient(to bottom, rgb(250, 70, 71), rgb(224, 11, 11));
  color: transparent;
  background-clip: text;
  width: fit-content;
  height: fit-content;
  text-align: center;
}
.title h3 {
  font-size: 3em;
}
.title p {
  color: white;
  margin: 0;
  font-size: 1.75em;
}

.logins form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;
}

.email, .password {
  width: 25em;
  font-size: var(--h3);
  padding: 0.25em;
  border-radius: 0.8em;
  color: white;
  background-color: #0c1824;
  border-color: #d61a1a;  
  border-style: solid;
}

.email::placeholder, .password::placeholder {
  color: white;
  opacity: 1;
}

.submit {
  font-size: var(--h3);
  padding: 0.5em;
  width: 6em;
  border-radius: 1em;
  background-color: #0c1824;
  border-color: #ff5152;
  color: white;
  border-style: solid;
  transition: all 0.5s;
}

.switch {
  height: fit-content;
  background-color: transparent;
  border: 0;
  color: white;
}
.switch h3 {
  margin: 0;
  font-size: 1.75em;
  text-decoration: underline;
}

.quoteBackground {
  margin-top: 7em;
  background-color: #d6941a;
  padding: 0.2em;
  border-radius: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
}
.quote {
  background-color: #0c1824;
  color: var(--gold);
  padding: 2em;
  border-radius: 2em;
  width: 50em;
  text-align: center;
  text-wrap: wrap;
}

.quoteTitle {
  color: var(--deepYellow);
}
.quote h3 {
  margin: 0;
}

@media screen and (max-width: 1200px) {
  .title h1 {
    font-size: var(--h2);
  }
}

@media screen and (max-width: 800px) {
  .title {
    width: 90%;
  }
  .title h1 {
    font-size: 2.75em;
    width: 90%;
  }
  .title p {
    font-size: 1.5em;
    width: 80%;
  }
  .title h3 {
    display: none;
    width: 1px;
    height: 1px;
    font-size: 1px;
  }
  .titleBorder {
    padding: 0.5vw;
  }
  .titleBackground {
    flex-direction: column;
    height: fit-content;
    gap: 1em;
    padding: 0.5vw;
    width: 90vw;
  }
  .email, .password {
    width: 90vw;
    font-size: 1.5em;
  }
  .quoteBackground {
    margin-bottom: 5em;
  }
  .quote {
    width: 90vw;
    padding: 2vw;
  }
  .switch {
    width: 90vw;
  }
}

@media (hover: hover) and (pointer: fine) {
.submit:hover {
  background-color: #d61a1a;
}
}

</style>
