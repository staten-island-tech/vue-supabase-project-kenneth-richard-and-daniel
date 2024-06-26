<template>
  <header v-if="!['/', '/login'].includes(route.fullPath)">
    <div class="headerDiv">
      <div class="logoBackground">
        <div class="logo">
          <img src="/valorant.svg" alt="VALORANT Logo">
          <div class="logoTitle">
            <h2>VALORANT Case Opener</h2>
            <p><span>{{ email }}</span> <button class="account" @click="signout = true"><img src="/exit.svg" alt="Click to sign out of your account"></button></p>
          </div>
        </div>
      </div>
      <nav class="navBar">
        <RouterLink to="/lootbox" class="navButton lootboxes" :class="{ enabled: route.path == '/lootbox', disabled: email == '' }">
          <img src="/chest.svg" alt="Lootboxes">
          <h3>Lootboxes</h3>
        </RouterLink>
        <RouterLink to="/inventory" class="navButton inventoryButton" :class="{ enabled: route.path == '/inventory', disabled: email == '' }">
          <img src="/backpack.svg" alt="Inventory">
          <h3>Inventory</h3>
        </RouterLink>
        <!--<RouterLink to="/trade-search" class="navButton searcher" :class="{ enabled: route.path == '/trade-search', disabled: email == '' }">
          <img src="/magnify.svg" alt="Searcher">
          <h3>Trade</h3>
        </RouterLink>-->
      </nav>
    </div>
  </header>
  
  <Transition name="signout">
    <div class="signoutBackground" v-if="signout">
      <div class="signoutMenu">
        <h1>Do you want to sign out?</h1>
        <div class="signoutButtons">
          <button class="yes" @click="logout">
            <img src="/check.svg" alt="Click to confirm sign out">
          </button>
          <button class="no" @click="signout = false">
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
import { clientStore } from '@/stores/client';
import router from './router';
import { delay } from './assets/functions';

const signout = ref<boolean> (false);
const route = ref(useRoute());
const email = ref<string | undefined> ("");

watch(() => sessionStore().session, (newSession) => email.value = newSession.email);

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
      email: storedAuthJSON.user.email,
      newPlayer: false
    });

    const intendedRoute = clientStore().intendedRoute;
    if (["/", "/login"].includes(intendedRoute) || ["/", "/login"].includes(route.value.fullPath)) {
      router.push("/lootbox");
    }
  }
});

function logout (): void {
  sessionStore().changeSession({
    access_token: "",
    refresh_token: "",
    token_type: "",
    authenticated: false,
    id: "",
    email: "",
    newPlayer: false
  });
  clientStore().changeInventory([]);
  
  clientStore().intendedRoute = String(route.value.name);
  localStorage.removeItem("sb-toztwtlkcpaxhvmqtbdu-auth-token");

  signout.value = false;
}

</script>

<style scoped>

.disabled {
  cursor: not-allowed;
}

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
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  border-radius: 5vh;
  padding: 3vh;
  overflow-y: auto;
  color: white;
  text-align: center;
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
  height: fit-content;
  width: 35%;
}

.signoutButtons button img {
  width: 3em;
  height: 3em;
}

.yes {
  background-color: #ff5152;
}
.no {
  background-color: #51ff60;
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
  width: 100vw;
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

.logoBackground {
  background: linear-gradient(to bottom, #ff5152, #db0000);
  padding: 0.2em;
  border-radius: 5em;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 7.5em;
  padding-right: 7.5em;
  gap: 5%;
  background-color: rgba(12, 24, 36, 0.85);
  color: white;
  border-radius: 5em;
  height: 10em;
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
  width: 55em;
  height: fit-content;
}
.navButton {
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
.inventoryButton {
  background-color: var(--cyan);
  border-radius: 3em;
}

.searcher {
  background-color: var(--deepGreen);
  border-radius: 3em;
}

.navBar img {
  max-width: 85%;
  max-height: 85%;
}

.enabled {
  filter: grayscale(0);
}

@media screen and (max-width: 1600px) {
  .navButton {
    width: 10em;
  }
  .navButton h3 {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .headerDiv {
    flex-direction: column;
  }

  .navBar {
    margin-top: 1em;
  }
  .navButton {
    width: 19.5em;
  }
  .navButton h3 {
    display: block;
  }

  header {
    height: 25em;
    position: absolute;
  }
  .signoutMenu {
    width: 70%;
  }
}

@media screen and (max-width: 800px) {
  .logo {
    padding: 0;
    width: 95vw;
  }
  .logo img {
    max-width: 1px;
    max-height: 1px;
    display: none;
  }
  .logoTitle h2 {
    font-size: var(--h3);
  }
  .logoTitle p {
    width: fit-content;
  }
  .logoTitle p span {
    font-size: 1px;
    display: none;
  }
  .logoTitle p button {
    width: 25vw;
    height: fit-content;
    padding: 1vw;
  }
  .logoTitle p button img {
    display: unset;
    max-width: unset;
    max-height: unset;
  }
  .navButton {
    width: 25vw;
    padding: 0.5vw;
  }
  .navButton h3 {
    display: none;
  }
  .signoutMenu h1 {
    font-size: var(--h2);
  }
  .navBar {
    width: 95vw;
  }
  .signoutButtons button {
    width: 45%;
  }
}

@media (hover: hover) and (pointer: fine) {
.yes {
  background-color: #ffc6c6;
}
.no {
  background-color: #c5ffca;
}
.yes:hover {
  background-color: #ff5152;
}
.no:hover {
  background-color: #51ff60;
}
.account:hover {
  background-color: #51ff60;
}
.navButton:hover {
  filter: grayscale(0);
}
}

</style>