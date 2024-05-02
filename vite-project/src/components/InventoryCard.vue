<template>
    <div class="itemCardMenu" :class="{ common: item.rarity == 'Common', rare: item.rarity == 'Rare',
    epic: item.rarity == 'Epic', legendary : item.rarity == 'Legendary', godly: item.rarity == 'Godly' }">
        <h1 class="title">{{ item.displayName }}</h1>
        <h3 class="title">{{ item.rarity }} {{ item.defaultName }}</h3>
        <img :src="item.displayIcon" :alt="item.displayName">
        <h3>You have {{ item.inventoryCount }}</h3>
        <div class="buttonArray">
          <button class="finishedButton deleteButton" @click="deleteItem(item)">
            <img src="/trash.svg" alt="Click to delete this item">
            <h3>Delete Item</h3>
          </button>
          <button class="finishedButton closeButton" @click="closeCard">
            <img src="/cancel.svg" alt="Click to close this card">
            <h3>Close</h3>
          </button>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { WeaponSkin } from '@/assets/types';
import { ref, defineEmits } from 'vue';

type Props = {
    item: WeaponSkin;
}

const props = defineProps<Props> ();

const emit = defineEmits(["close"]);

function closeCard (): void {
  emit("close");
}

async function deleteItem (item: WeaponSkin): Promise<void> {

}

</script>

<style scoped>

.itemCardMenu {
  min-width: 75em;
  max-width: 125em;
  padding: 5em;
  border-radius: 3vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 80%;
  min-height: 50%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: black;
}
.title {
  margin: 0;
  color: black;
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

.buttonArray {
  display: flex;
  justify-content: space-evenly;
  width: 75%;
  margin-top: 1em;
}

.finishedButton {
  width: 50%;
  font-size: var(--p);
  height: 6.5em;
  border-radius: 1.5em;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10%;
  filter: grayscale(0.33);
  border: solid;
  border-width: 0.1em;
  text-decoration: none;
}

.deleteButton {background-color: #ff5050}
.closeButton {background-color: #50dcff}

.finishedButton h3 {
  margin: 0;
  text-align: center;
  width: fit-content;
  height: fit-content;
  font-size: var(--h3);
}

.finishedButton img {
  background-color: transparent;
}

.finishedButton > * {
  width: 5vh;
  height: 5vh;
  margin-right: 0;
}

.finishedButton:hover {
  filter: grayscale(0);
}

</style>