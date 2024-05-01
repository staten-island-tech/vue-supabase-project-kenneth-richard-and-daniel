<template>
  <header>
    <div class="headerDiv">
      <div class="logo">
        <img src="/valorant.svg" alt="VALORANT Logo">
        <div class="logoTitle">
          <h2>VALORANT Case Opener</h2>
          <p v-if="email != ''">{{ email }} <button class="account" @click="signout = true"><img src="/exit.svg" alt="Click to sign out of your account"></button></p>
        </div>
      </div>
      <nav class="navBar">
        <RouterLink to="/" class="lootboxes" :class="{ enabled: route.path == '/' }">
          <img src="/chest.svg" alt="Lootboxes">
          <h3>Lootboxes</h3>
        </RouterLink>
        <RouterLink to="/inventory" class="inventoryButton" :class="{ enabled: route.path == '/inventory' }">
          <img src="/backpack.svg" alt="Inventory">
          <h3>Inventory</h3>
        </RouterLink>
        <RouterLink to="/trade-search" class="trade" :class="{ enabled: route.path == '/trade-search'}">
          <img src="/magnify.svg" alt="Searcher">
          <h3>Trade</h3>
        </RouterLink>
      </nav>
    </div>
  </header>
  
  <Transition name="signout">
    <div class="signoutBackground" v-if="signout">
      <div class="signoutMenu">
        <h1>Do you want to sign out?</h1>
        <div class="signoutButtons">
          <button class="yes" @click="logout">
            Yes, sign out.
            <img src="/check.svg" alt="Click to confirm sign out">
          </button>
          <button class="no" @click="signout = false">
            No, go back.
            <img src="/cancel.svg" alt="Click to return to game">
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <RouterView/>

</template>

<script setup lang="ts">

import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue';
import { sessionStore } from './stores/session';

const signout = ref<boolean> (false);
const route = ref(useRoute());
const email = ref<string | undefined> ("");

watch(() => sessionStore().session, (newSession) => {
  email.value = newSession.email;
});

onMounted(() => {
  const storedAuth = localStorage.getItem("sb-toztwtlkcpaxhvmqtbdu-auth-token");
  if (storedAuth != null) {
    const storedAuthJSON = JSON.parse(storedAuth);
    sessionStore().changeSession({
      access_token: storedAuthJSON.access_token,
      refresh_token: storedAuthJSON.refresh_token,
      token_type: storedAuthJSON.token_type,
      authenticated: true,
      id: storedAuthJSON.user.id,
      email: storedAuthJSON.user.email
    });
  }
});

function logout (): void {
  sessionStore().changeSession({
    access_token: "",
    refresh_token: "",
    token_type: "",
    authenticated: false,
    id: "",
    email: ""
  });

  localStorage.removeItem("sb-toztwtlkcpaxhvmqtbdu-auth-token");

  signout.value = false;
}

</script>

<style scoped>

.signoutBackground {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 999999999;
}

.signoutMenu {
  width: fit-content;
  width: 40%;
  height: fit-content;
  min-height: 40%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  border-radius: 5vh;
  padding: 3vh;
  overflow-y: auto;
  color: white;
}

.signoutButtons {
  display: flex;
  width: 90%;
  justify-content: center;
  gap: 10%;
}

.signoutButtons button {
  font-size: 2.5em;
  transition: all 0.5s;
  padding: 0.5em;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  height: 2.65em;
  width: 35%;
}

.signoutButtons button img {
  width: 3em;
  height: 3em;
  margin-top: 1em;
}

.yes {
  background-color: #ffc6c6;
}
.no {
  background-color: #c5ffca;
}

.yes:hover {
  background-color: #ff5152;
  height: 6.75em;
}
.no:hover {
  background-color: #51ff60;
  height: 6.75em;
}

.signout-enter-active, .signout-leave-active {
  transition: all 0.5s ease-in-out;
}

.signout-leave-active {
  transition-delay: 0.15s;
}

.signout-enter-from,
.signout-leave-to {
  opacity: 0;
}

.signout-enter-active .signoutMenu,
.signout-leave-active .signoutMenu { 
  transition: all 0.25s ease-in-out;
}

.signout-enter-active .signoutMenu {
  transition-delay: 0.15s;
}

.signout-enter-from .signoutMenu,
.signout-leave-to .signoutMenu {
  transform: scale(1.05);
  opacity: 0.001;
}

.account {
  background-color: #ff5152;
  font-weight: bold;
  transition: all 0.25s;
  color: white;
  border-radius: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
}
.account:hover {
  background-color: #51ff60;
}
.account img {
  width: 3em;
  height: 3em;
}

.logoTitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logoTitle p {
  margin: 0;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110%;
  gap: 3%;
  text-wrap: nowrap;
}

header {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 90%, transparent);
  width: 100%;
  height: 17em;
  position: fixed;
  z-index: 9999999;
  display: flex;
  justify-content: center;
}

.headerDiv {
  display: flex;
  width: 95%;
  align-items: center;
  justify-content: space-between;
  height: 10em;
  margin-top: 2em;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 7.5em;
  padding-right: 7.5em;
  gap: 5%;
  background-color: rgb(255, 144, 80);
  border-radius: 5em;
  height: 100%;
}
.logo h2 {
  margin: 0;
  font-size: 2.8em;
  text-wrap: nowrap;
}
.logo img {
  max-width: 85%;
  max-height: 85%;
}

.navBar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5%;
  width: 70em;
  height: fit-content;
}
.navBar > * {
  margin: 0;
  display: flex;
  gap: 3%;
  height: 8em;
  align-items: center;
  justify-content: center;
  width: fit-content;
  width: 45%;
  border-radius: 5em;
  filter: grayscale(1);
  transition: all 0.5s;
}

.lootboxes {
  background-color: var(--deepYellow);
  border-radius: 3em;
}
.lootboxes:hover {
  filter: grayscale(0);
}
.inventoryButton {
  background-color: var(--cyan);
  border-radius: 3em;
}
.inventoryButton:hover {
  filter: grayscale(0);
}

.searcher {
  background-color: var(--deepGreen);
  border-radius: 3em;
}
.searcher:hover {
  filter: grayscale(0);
}

.navBar img {
  max-width: 85%;
  max-height: 85%;
}

.enabled {
  filter: grayscale(0);
}

</style>