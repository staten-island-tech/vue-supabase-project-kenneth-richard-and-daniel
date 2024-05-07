<template>
    <div class="renameThisLaterOrDeleteIDK">
        <div id="trade-box">
            <h3>Trade Requests Avaliable</h3>
        </div>
        <Transition name="create">
            <div class="createBackground" v-if="clicked">
                <label for="bombaclad" id="bombaclad">Select Weapon You're Trading</label>
                <button id="bombaclad2" @click="clicked2 = true">+</button> 
                <Transition name="create">
                  <div class="createBackground" v-if="clicked2">
                    <div class="search">
                      <h3>Search</h3>
                      <input type="text" placeholder="Type to narrow search" @input="searchInventory">
                    </div>
                    <button id="exit2" @click="clicked2 = false">Exit</button>
                  </div>
                </Transition>
                <img src="/tradeTwo.svg" alt="arrow" id="arrow2">
                <label for="bombaclad" id="bombaclad">Select Weapon You Want</label>
                <button id="bombaclad" @click="clicked3 = true">+</button> 
                <Transition name="create">
                  <div class="createBackground" v-if="clicked3">
                    <button id="exit2" @click="clicked3 = false">Exit</button>
                  </div>
                </Transition>
                <div class="buttonArray">
                    <button id="publish" @click="create">Publish</button>
                    <button id="exit" @click="clicked = false">Quit</button>
                </div>
            </div>

        </Transition>
            <div class="button">
                <button class="create" @click="clicked = true">Create a Trade Request</button>
            </div>
    </div>
</template>

<script setup lang="ts">

import { watchLogout } from '@/assets/functions';
import { sessionStore } from '@/stores/session';
import { onMounted, ref, watch } from 'vue';

watch(() => sessionStore().session, (newSession) => watchLogout(newSession));

onMounted(() => {
    watchLogout(sessionStore().session);
});

const clicked = ref(false);
const clicked2 = ref(false);
const clicked3 = ref(false);
const searchParam = ref<string> ("");
  const inventory = ref<Inventory> ([]);
const filled = ref("");
const filled2 = ref("");

function create() {
    if (!filled.value && !filled2.value) {
        return;
    }
}

function searchInventory (event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value;
  searchParam.value = inputValue;
  inventory.value = mutatedInventory.filter((item) => item.displayName.toLowerCase().includes(inputValue.toLowerCase()));
}

</script>

<style scoped>
#arrow2 {
    width: 8em;
    height: 8em;
}

#bombaclad, #bombaclad2{
    color: red;
    font-size: 4em;
}

#trade-box {
    margin-top: 17em;
    background-color: rgb(6, 146, 99);
    border-radius: 15px;
}

.createBackground {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  overflow: hidden;
  z-index: 99999999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.createMenu {
  min-width: 75em;
  max-width: 125em;
  padding: 20px;
  border-radius: 3vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 80%;
  min-height: 30%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
}

.createImg {
  max-width: 40%;
}
.createImgBig {
  max-width: 90%;
  min-width: 70%;
}

.create-enter-active, .create-leave-active {
  transition: all 0.3s ease-in-out;
}

.create-leave-active {
  transition-delay: 0.07s;
}

.create-enter-from,
.create-leave-to {
  opacity: 0;
}

.create-enter-active .createMenu,
.create-leave-active .createMenu { 
  transition: all 0.07s ease-in-out;
}

.create-enter-active .createMenu {
  transition-delay: 0.07s;
}

.create-enter-from .createMenu,
.create-leave-to .createMenu {
  transform: scale(1.05);
  opacity: 0.001;
}

.createText {
  position: absolute;
  display: none;
  margin: 0;
}

 .createText:hover {
  display: block;
}

.creatingText {
  position: absolute;
  margin: 0;
}
</style>