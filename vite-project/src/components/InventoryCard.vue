<template>
    <Transition name="delete">
    <div class="deleteBackground" v-if="deleteMenu">
      <div class="deleteMenu">
        <h2>Are you sure you want to delete this item?</h2>
        <h3><span style="color: var(--gold)">ALL</span> copies of the 
          <span :class="{ commonText: item.rarity == 'Common', rareText: item.rarity == 'Rare', epicText: item.rarity == 'Epic',
          legendaryText: item.rarity == 'Legendary', godlyText: item.rarity == 'Godly' }">
            {{ item.displayName }}
          </span> 
          will be removed.</h3>
        <h3><strong style="color: #ff5050; font-size: 1.25em;">This action is unrecoverable!</strong></h3>
        <div class="deleteButtons">
          <button class="yes" @click="deleteItem(item)">
            <img src="/trash.svg" alt="Click to confirm sign out">
          </button>
          <button class="no" @click="deleteMenu = false">
            <img src="/cancel.svg" alt="Click to return to game">
          </button>
        </div>
      </div>
    </div>
  </Transition>
  
  <div class="itemCardMenu" :class="{ common: item.rarity == 'Common', rare: item.rarity == 'Rare',
  epic: item.rarity == 'Epic', legendary: item.rarity == 'Legendary', godly: item.rarity == 'Godly' }">
      <h1 class="title">{{ item.displayName }}</h1>
      <h3 class="title">{{ item.rarity }} {{ item.defaultName }}</h3>
      <img :src="item.displayIcon" :alt="item.displayName" :class="{ unlockImg: item.category == 'Pistols' || item.category == null, unlockImgBig: item.category != 'Pistols' && item.category != null }">
      <h3 class="description" v-if="item.inventoryCount != 0">First unlocked: <span>{{ formatDate(item.date) }}</span></h3>
      <h3 class="description" v-else>You have not unlocked this item yet!</h3>
      <h3 class="description" v-if="item.inventoryCount != 0">You have: <span>{{ item.inventoryCount }}</span></h3>
      <div class="buttonArray">
        <button class="finishedButton deleteButton" @click="openDeleteMenu" :class="{ disabledDelete: item.inventoryCount == 0 }">
          <img src="/trash.svg" alt="Click to delete all of this item">
          <h3>Delete All</h3>
        </button>
        <button class="finishedButton closeButton" @click="closeCard">
          <img src="/cancel.svg" alt="Click to close this card">
          <h3>Close</h3>
        </button>
      </div>
  </div>
</template>

<script setup lang="ts">

import { formatDate } from '@/assets/functions';
import type { WeaponSkin } from '@/assets/types';
import { supabase } from '@/lib/supabaseClient';
import { clientStore } from '@/stores/client';
import { sessionStore } from '@/stores/session';
import { ref } from 'vue';

type Props = {
    item: WeaponSkin;
}

const props = defineProps<Props> ();
const deleteMenu = ref<boolean> (false);

const emit = defineEmits(["close"]);

function openDeleteMenu (): void {
  if (props.item.inventoryCount != 0) deleteMenu.value = true;
}

function closeCard (): void {
  emit("close");
}

async function deleteItem (item: WeaponSkin): Promise<void> {
  try {
    const { error } = await supabase.from("inventory").delete().eq("id", sessionStore().session.id).eq("skin_name", item.displayName);
    if (error) throw error;

    clientStore().changeInventory(clientStore().currentInventory.filter((inventoryItem) => inventoryItem != item));
    emit("close");

  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
}

</script>

<style scoped>

.unlockImg {
  max-width: 40%;
}
.unlockImgBig {
  max-width: 90%;
  min-width: 70%;
}

.deleteBackground {
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

.deleteMenu {
  width: fit-content;
  min-width: 40%;
  max-width: 50%;
  min-height: 50%;
  max-height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  border-radius: 5vh;
  padding: 5em;
  overflow-y: auto;
  color: white;
  text-align: center;
}
.deleteMenu h2 {
  margin-top: 0.5em;
  margin-bottom: 0;
}
.deleteMenu h3 {
  margin-top: 0.5em;
  margin-bottom: 0;
}

.deleteButtons {
  display: flex;
  width: 90%;
  justify-content: center;
  gap: 10%;
  margin-top: 3em;
  height: 15em;
}

.deleteButtons button {
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

.deleteButtons button img {
  width: 3em;
  height: 3em;
}

.yes {
  background-color: #ff5152;
}
.no {
  background-color: #51ff60;
}

.delete-enter-active, .delete-leave-active {
  transition: all 0.5s ease-in-out;
}

.delete-leave-active {
  transition-delay: 0.15s;
}

.delete-enter-from,
.delete-leave-to {
  opacity: 0;
}

.delete-enter-active .deleteMenu,
.delete-leave-active .deleteMenu { 
  transition: all 0.25s ease-in-out;
}

.delete-enter-active .deleteMenu {
  transition-delay: 0.15s;
}

.delete-enter-from .deleteMenu,
.delete-leave-to .deleteMenu {
  transform: scale(1.05);
  opacity: 0.001;
}

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
.itemCardMenu img {
  margin-top: 2em;
  margin-bottom: 2em;
}
.title {
  margin: 0;
  color: black;
}
.description {
  margin: 0;
  color: black;
}
.description span {
  font-size: 1.33em;
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

.commonText {
  color: var(--common);
}
.rareText {
  color: var(--rare);
}
.epicText {
  color: var(--epic);
}
.legendaryText {
  color: var(--legendary);
}
.godlyText {
  background-image: var(--godlyText);
  width: fit-content;
  color: transparent;
  background-clip: text;
}

.buttonArray {
  display: flex;
  justify-content: space-evenly;
  width: 75%;
  margin-top: 5em;
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
  filter: grayscale(0.2);
  border: solid;
  border-width: 0.1em;
  text-decoration: none;
}

.deleteButton {background-color: #ff5152}
.closeButton {background-color: var(--deepGreen)}

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

.disabledDelete {
  filter: grayscale(1);
}

@media screen and (max-width: 1200px) {
  .itemCardMenu {
    min-width: unset;
    max-width: unset;
    max-height: 90%;
    width: 75vw;
  }
  .itemCardMenu h1 {
    font-size: var(--h2);
  }
  .deleteMenu {
    min-width: unset;
    max-width: unset;
    width: 65vw;
  }
  .buttonArray {
    width: 90%;
  }
}

@media screen and (max-width: 800px) {
  .itemCardMenu {
    min-height: 65%;
    width: 95vw;
    padding: 1vw;
    justify-content: center;
    gap: 1vh;
  }
  .itemCardMenu h1 {
    font-size: 2.75em;
  }
  .buttonArray {
    margin-top: 2em;
    width: 80%;
    flex-direction: column;
    align-items: center;
  }
  .buttonArray button {
    width: 100%;
  }
  .deleteMenu {
    width: 95vw;
    padding: 0;
    min-height: 50%;
    max-height: 80%;
  }
  .deleteMenu h2 {
    font-size: 2.75em;
    width: 80%;
  }
  .deleteMenu h3 {
    font-size: 2em;
    width: 80%;
  }
  .deleteButtons {
    height: fit-content;
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
.finishedButton:hover {
  filter: grayscale(0);
}
.disabledDelete:hover {
  filter: grayscale(1);
}
}

</style>