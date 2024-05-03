<template>

  <Transition name="itemCard">
      <div v-if="showItemCard" class="itemCardBackground">
        <InventoryCard :item="currentItem" @close="showItemCard = false" />
      </div>
    </Transition>
  
  <div class="sort" v-if="session && session.access_token != ''">
      <button class="reverseButton" @click="reverseInventory">
        <img src="/arrowSortBottom.svg" alt="Click to reverse the inventory filter" :class="{ reversed: sortReverse == true }">
      </button>

      <button @click="sortInventory('date')" class="sortButton" :class="{ enabled: sortOption == 'date' }">Sort by Date</button>
      <button @click="sortInventory('rarity')" class="sortButton" :class="{ enabled: sortOption == 'rarity' }">Sort by Rarity</button>
      <button @click="sortInventory('count')" class="sortButton" :class="{ enabled: sortOption == 'count' }">Sort by Count</button>
  </div>

  <div v-if="session && session.access_token != ''" class="inventory">
      <div v-for="item in inventory" class="inventoryItem"
      :class="{ common: item.rarity == 'Common', rare: item.rarity == 'Rare', epic: item.rarity == 'Epic',
      legendary : item.rarity == 'Legendary', godly: item.rarity == 'Godly' }"
      @click="sendItemToCard(item)">
          <h2>{{ item.displayName }}</h2>
          <img :src="item.displayIcon" :alt="item.displayName">
          <h3>x{{ item.inventoryCount }}</h3>
      </div>

      <div v-if="inventory.length == 0" class="wompwomp">
          <h2>You don't have any items. L Bozo</h2>
          <h3>Open some boxes to get started! :D</h3>
      </div>
  </div>

  <LoginAuth v-else/>

</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';
import { getSkins } from '@/stores/lootboxes';
import type { Inventory, NewWeapon, WeaponSkin } from '@/assets/types';
import { clientStore } from '@/stores/client';
import LoginAuth from '@/components/LoginAuth.vue';
import InventoryCard from '@/components/InventoryCard.vue';

type ApiData = {
    skin_id: number;
    id: string;
    skin_name: string;
    date: string;
}

const session = ref<any> ();
const loaded = ref<boolean> (false);
const inventory = ref<Inventory> ([]);
const sortOption = ref<string> ("date");
const showItemCard = ref<boolean> (false);
const sortReverse = ref<boolean> (false);
const currentItem = ref<WeaponSkin> ({
  defaultName: "",
  category: "",
  displayIcon: "",
  displayName: "",
  levelsCount: 0,
  wallpaper: "",
  rarity: "",
  inventoryCount: 0,
  date: ""
});

let originalInventory: Inventory = [];

watch(() => sessionStore().session, (newSession) => session.value = newSession);
watch(() => clientStore().currentInventory, (newInventory) => inventory.value = newInventory);

onMounted(async () => {
    session.value = sessionStore().session;
    loaded.value = false;
    inventory.value = clientStore().currentInventory;
    sortOption.value = clientStore().sort;
    sortReverse.value = clientStore().reversed;
    getInventory();
});

function reverseInventory (): void {
  inventory.value = [...inventory.value].reverse();
  clientStore().reversed = !sortReverse.value;
  sortReverse.value = !sortReverse.value;
}

function sendItemToCard (item: WeaponSkin): void {
  currentItem.value = item;
  showItemCard.value = true;
}

function sortInventory (sortBy: "rarity" | "count" | "date"): void {
    clientStore().sort = sortBy;
    sortOption.value = sortBy;

    if (sortBy == "rarity") {
        const newInventory: Inventory = [];
        newInventory.push(...originalInventory.filter((item) => item.rarity == "Common"));
        newInventory.push(...originalInventory.filter((item) => item.rarity == "Rare"));
        newInventory.push(...originalInventory.filter((item) => item.rarity == "Epic"));
        newInventory.push(...originalInventory.filter((item) => item.rarity == "Legendary"));
        newInventory.push(...originalInventory.filter((item) => item.rarity == "Godly"));
        inventory.value = sortReverse.value == true ? [...newInventory].reverse() : newInventory;
    } else if (sortBy == "count") {
        inventory.value = sortReverse.value == true ? [...originalInventory].sort((a, b) => a.inventoryCount - b.inventoryCount).reverse() : [...originalInventory].sort((a, b) => a.inventoryCount - b.inventoryCount);
    } else if (sortBy == "date") {
        inventory.value = sortReverse.value == true ? [...originalInventory].reverse() : [...originalInventory];
    }

    clientStore().currentInventory = inventory.value;
}

async function getInventory (): Promise<void> {
    const skins = await getSkins();
    const inventoryUser = await getData();
    
    const allSkins: WeaponSkin[][] = skins.map((item: NewWeapon) => item.skins);
    const emptyArray: WeaponSkin[] = [];
    const combinedSkins: WeaponSkin[] = emptyArray.concat(...allSkins);
    
    const inventorySkins = inventoryUser.map((item) => item.skin_name);

    const inventoryTranslated: Inventory = [];

    for (let skin of inventorySkins) {
        const found: WeaponSkin | undefined = combinedSkins.find((item) => skin == item.displayName);

        if (found && inventoryTranslated.includes(found)) {
          found.inventoryCount++;

        } else if (found) {
          const foundInInventory = inventoryUser.find((item) => item.skin_name == found.displayName);
          if (foundInInventory) found.date = foundInInventory.date;

          inventoryTranslated.push(found);
        }
    }
    
    originalInventory = inventoryTranslated;
    sortInventory(clientStore().sort);

    clientStore().currentInventory = inventory.value;

    loaded.value = true;
}

async function getData (): Promise<ApiData[]> {
    let apiData: ApiData[] = [{
        skin_id: 0,
        id: "",
        skin_name: "",
        date: ""
    }];
    try {
        const { data, error } = await supabase.from('inventory').select()
        if (error) throw error;

        apiData = data.filter((user) => user.id == sessionStore().session.id);

    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    }

    return apiData;
}

</script>

<style scoped>

.itemCardBackground {
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

.itemCard-enter-active, .itemCard-leave-active {
  transition: all 0.5s ease-in-out;
}

.itemCard-leave-active {
  transition-delay: 0.15s;
}

.itemCard-enter-from,
.itemCard-leave-to {
  opacity: 0;
}

.itemCard-enter-active .itemCardMenu,
.itemCard-leave-active .itemCardMenu { 
  transition: all 0.25s ease-in-out;
}

.itemCard-enter-active .itemCardMenu {
  transition-delay: 0.15s;
}

.itemCard-enter-from .itemCardMenu,
.itemCard-leave-to .itemCardMenu {
  transform: scale(1.05);
  opacity: 0.001;
}

.wompwomp {
  background-color: #ff5050;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
  border-radius: 5em;
}

.sort {
  margin-top: 19em;
  margin-bottom: 4em;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5%;
}

.reverseButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6em;
  height: 5em;
  border-radius: 2.5em;
  overflow: hidden;
  background-color: var(--pastelYellow);
  transition: all 0.5s;
}
.reverseButton img {
  width: 3.5em;
  height: 3.5em;
  transition: all 0.5s;
}
.reverseButton:hover {
  transform: scale(1.1);
}
.reverseButton:hover img {
  transform: rotate(180deg);
}
.reversed {
  transform: rotate(180deg);
}

.sortButton {
  width: 30%;
  height: 3em;
  font-size: 2em;
  border-radius: 1.25em;
  background-color: var(--deepGreen);
  filter: grayscale(1);
  transition: all 0.5s;
  color: black;
}
.sortButton:hover {
  filter: grayscale(0);
}

.enabled {
  filter: grayscale(0);
  color: black;
}

.inventory {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5%;
  width: 90%;
}

.inventoryItem {
  width: 20%;
  min-height: 25em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1%;
  text-align: center;
  gap: 2em;
  border-radius: 3em;
  transition: transform 1s;
}
.inventoryItem h2 {
    margin: 0;
    font-size: 2.5em;
}
.inventoryItem h3 {
    margin: 0;
}

.inventoryItem img {
  max-width: 60%;
  max-height: 60%;
}
.inventoryItem:hover {
  transform: scale(1.05);
}

.common {
  background-color: var(--common);
}
.rare {
  background-color: var(--rare);
}
.epic {
  background-color: var(--epic);
}
.legendary {
  background-color: var(--legendary);
}
.godly {
  background: var(--godly);
}

</style>