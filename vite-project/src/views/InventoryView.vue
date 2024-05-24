<template>

  <Transition name="itemCard">
    <div v-if="showItemCard" class="itemCardBackground">
      <InventoryCard :item="currentItem" @close="showItemCard = false" />
    </div>
  </Transition>

  <Transition name="itemCard">
    <div v-if="newPlayerCheck" class="itemCardBackground">
      <NewPlayerCard @close="newPlayerCheck = false" />
    </div>
  </Transition>
  
  <div class="sort">
      <button class="reverseButton" @click="reverseInventory">
        <img src="/arrowSortBottom.svg" alt="Click to reverse the inventory filter" :class="{ reversed: sortReverse == true }">
      </button>
      
      <button class="hideButton" @click="showLocked" :class="{ notHidden: !showLockedBool }">
        <img src="/hide.svg" alt="Click to show undiscovered skins" v-if="!showLockedBool">
        <img src="/show.svg" alt="Click to hide undiscovered skins" v-if="showLockedBool">
      </button>

      <button @click="sortInventory('date')" class="sortButton" :class="{ enabled: sortOption == 'date' }"><span>Sort by </span>Date</button>
      <button @click="sortInventory('rarity')" class="sortButton" :class="{ enabled: sortOption == 'rarity' }"><span>Sort by </span>Rarity</button>
      <button @click="sortInventory('weapon')" class="sortButton" :class="{ enabled: sortOption == 'weapon' }"><span>Sort by </span>Weapon</button>
  </div>

  <div class="search">
    <h3>Search</h3>
    <input type="text" placeholder="Type to narrow search" @input="searchInventory">
  </div>

  <div class="inventory">
      <div v-for="item in inventory" class="inventoryItem"
      :class="{ common: item.rarity == 'Common', rare: item.rarity == 'Rare', epic: item.rarity == 'Epic',
      legendary : item.rarity == 'Legendary', godly: item.rarity == 'Godly', lockedItem: item.inventoryCount == 0 }"
      @click="sendItemToCard(item)">
          <h2>{{ item.displayName }}</h2>
          <img class="inventoryItemImg" :src="item.displayIcon" :alt="item.displayName" :class="{ karambit: ['Karambit', 'Blade', 'Imperium', 'Quo'].includes(item.displayName.split(' ')[item.displayName.split(' ').length - 1]) }">
          <h3 v-if="item.inventoryCount != 0">x{{ item.inventoryCount }}</h3>
          <h3 v-else>{{ item.rarity }}</h3>
      </div>

      <div v-if="inventory.length == 0" class="wompwomp">
          <h2>No items match your search. L Bozo</h2>
          <h3>Try searching for something else!</h3>
      </div>
  </div>

</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';
import { getSkins } from '@/stores/lootboxes';
import type { Inventory, NewWeapon, WeaponSkin } from '@/assets/types';
import { clientStore } from '@/stores/client';
import InventoryCard from '@/components/InventoryCard.vue';
import { watchLogout } from '@/assets/functions';
import NewPlayerCard from '@/components/NewPlayerCard.vue';

type ApiData = {
    skin_id: number;
    id: string;
    skin_name: string;
    date: string;
}

const loaded = ref<boolean> (false);
const inventory = ref<Inventory> ([]);
const sortOption = ref<string> ("date");
const showItemCard = ref<boolean> (false);
const sortReverse = ref<boolean> (false);
const showLockedBool = ref<boolean> (false);
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
const searchParam = ref<string> ("");
const newPlayerCheck = ref<boolean> (false);

let originalInventory: Inventory = [];
let mutatedInventory: Inventory = [];

watch(() => sessionStore().session, (newSession) => watchLogout(newSession));
watch(() => clientStore().currentInventory, (newInventory) => inventory.value = newInventory);
watch(() => clientStore().hidden, () => getInventory());

onMounted(async () => {
    watchLogout(sessionStore().session);
    loaded.value = false;
    inventory.value = clientStore().currentInventory;
    sortOption.value = clientStore().sort;
    sortReverse.value = clientStore().reversed;
    showLockedBool.value = clientStore().hidden;
    newPlayerCheck.value = sessionStore().session.newPlayer;
    getInventory();
});

function searchInventory (event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value;
  searchParam.value = inputValue;
  inventory.value = mutatedInventory.filter((item) => item.displayName.toLowerCase().includes(inputValue.toLowerCase()));
}

function reverseInventory (): void {
  inventory.value = [...inventory.value].reverse();
  clientStore().reversed = !sortReverse.value;
  sortReverse.value = !sortReverse.value;
}

function showLocked (): void {
  clientStore().changeHidden();
  showLockedBool.value = !showLockedBool.value;
}

function sendItemToCard (item: WeaponSkin): void {
  currentItem.value = item;
  showItemCard.value = true;
}

async function sortInventory (sortBy: "rarity" | "weapon" | "date"): Promise<void> {
    clientStore().sort = sortBy;
    sortOption.value = sortBy;

    let newInventory: Inventory = [];

    if (sortBy == "rarity") {
        const rarityOrder: Record<string, number> = {
          Godly: 5,
          Legendary: 4,
          Epic: 3,
          Rare: 2,
          Common: 1
        }
        newInventory = [...originalInventory].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        inventory.value = sortReverse.value == true ? [...newInventory].reverse() : newInventory;

    } else if (sortBy == "weapon") {
      for (let weapon of await getSkins()) newInventory.push(...originalInventory.filter((item) => item.defaultName == weapon.displayName));
      inventory.value = sortReverse.value == true ? [...newInventory].reverse() : newInventory;

    } else if (sortBy == "date") {
      for (let item of [...originalInventory].filter((item) => item.date)) {
        newInventory.push(item);
      }
      newInventory.push(...originalInventory.filter((item) => !item.date));
      inventory.value = sortReverse.value == true ? [...newInventory].reverse() : [...newInventory];
    }

    mutatedInventory = inventory.value;
    inventory.value = mutatedInventory.filter((item) => item.displayName.toLowerCase().includes(searchParam.value.toLowerCase()));
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

        if (found) {
          const foundInInventory: ApiData | undefined = inventoryUser.find((item) => item.skin_name == found.displayName);
          if (foundInInventory) {
            found.inventoryCount++;
            found.date = foundInInventory.date;
          } 

          inventoryTranslated.push(found);
        }
    }
    
    const remainingSkins = combinedSkins.filter((item) => inventoryUser.find((inventoryItem) => inventoryItem.skin_name == item.displayName)?.skin_name != (item.displayName))
    originalInventory = showLockedBool.value == true ? inventoryTranslated.concat(remainingSkins) : inventoryTranslated;
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
  margin-bottom: 1em;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5%;
}

.reverseButton, .hideButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.5em;
  height: 5em;
  border-radius: 2.5em;
  overflow: hidden;
  background-color: var(--pastelYellow);
  transition: all 0.5s;
}
.hideButton {
  background-color: var(--cyan);
}
.notHidden {
  filter: grayscale(1);
}
.lockedItem {
  filter: grayscale(0.95);
}
.reverseButton img, .hideButton img {
  width: 3.5em;
  height: 3.5em;
  transition: all 0.5s;
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
  width: 90vw;
}

.inventoryItem {
  width: 20%;
  min-height: 30em;
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
    width: 85%;
}
.inventoryItem h3 {
    margin: 0;
}

.inventoryItemImg {
  max-width: 60%;
  max-height: 60%;
}
.karambit {
  max-width: 40%;
  max-height: 40%;
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

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  gap: 5%;
  margin-bottom: 4em;
}
.search h3 {
  margin: 0;
  color: white;
}
.search input {
  width: 15em;
  font-size: 2em;
  padding: 0.25em;
  border-radius: 0.8em;
  color: black;
  background-color: #cacaca;
  border-style: solid;
  text-align: center;
}

.search input::placeholder {
  color: black;
  opacity: 1;
}

.search input:focus {
  outline: none;
  border-color: #ff5050;
}

@media screen and (max-width: 1600px) {
  .sort {
    width: 65%;
  }
}

@media screen and (max-width: 1200px) {
  .sort {
    margin-top: 25em;
    width: 85%;
  }
  .inventoryItem {
    width: 30%;
    min-height: 25em;
  }
  .inventoryItem h2 {
    font-size: 2.25em;
  }

}

@media screen and (max-width: 800px) {
  .sort {
    flex-wrap: wrap;
    width: 90vw;
  }
  .sortButton, .reverseButton {
    width: 45%;
  }
  .hideButton {
    display: none;
    width: 1px;
    height: 1px;
  }
  .search {
    width: 90vw;
  }
  .search h3 {
    display: none;
    width: 1px;
    height: 1px;
    font-size: 1px;
  }
  .search input {
    width: 100%;
  }
  .inventory {
    gap: 5%;
    margin-bottom: 5em;
  }
  .inventoryItem {
    width: 45%;
  }
  .inventoryItem h2 {
    font-size: 1.75em;
  }
}

@media screen and (max-width: 550px) {
  .sortButton span {
    display: none;
  }
  .inventoryItem {
    width: 90%;
    min-height: 17.5em;
  }
  .inventoryItem img {
    max-width: 40%;
    max-height: 40%;
  }
  .inventoryItem h3 {
    font-size: 1.5em;
  }
}

@media (hover: hover) and (pointer: fine) {
.reverseButton:hover, .hideButton:hover {
  transform: scale(1.1);
}
.reverseButton:hover img {
  transform: rotate(180deg);
}
.reverseButton:hover .reversed {
  transform: rotate(0deg);
}
.sortButton:hover {
  filter: grayscale(0);
}
.inventoryItem:hover {
  transform: scale(1.05);
}
}

</style>