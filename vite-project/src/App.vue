<template>
  <header>
    <div class="headerDiv">
      <div class="logo">
        <img src="/valorant.svg" alt="VALORANT Logo">
        <h2>VALORANT Case Opener</h2>
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
      </nav>
    </div>
  </header>

  <RouterView/>

</template>

<script setup lang="ts">

import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref } from 'vue';

const route = ref(useRoute());

</script>

<style scoped>

header {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 90%, transparent);
  width: 100%;
  height: 13em;
  position: fixed;
  z-index: 9999999;
}

.headerDiv {
  display: flex;
  width: 99vw;
  align-content: center;
  justify-content: space-around;
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
  height: 80%;
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
  width: 50em;
  height: fit-content;
}
.navBar > * {
  margin: 0;
  display: flex;
  gap: 5%;
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
}
.lootboxes:hover {
  filter: grayscale(0);
}
.inventoryButton {
  background-color: var(--cyan);
}
.inventoryButton:hover {
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