import { ref } from "vue";
import { defineStore } from "pinia";
import type { NewWeapon, Inventory } from "@/assets/types";

export const clientStore = defineStore("client", () => {
  const currentInventory = ref<Inventory> ([]);
  const currentPity = ref<number> (0);
  const currentWeapons = ref<NewWeapon[]>([]);

  function changePity (newPity: number) {
    currentPity.value = newPity;
  }

  function changeInventory (newInventory: Inventory) {
    currentInventory.value = newInventory;
  }

  const fastSpin = ref<boolean> (false);
  const sort = ref<"rarity" | "count" | "date"> ("date");
  const reversed = ref<boolean> (false);

  return { currentInventory, currentPity, currentWeapons, changePity, changeInventory, fastSpin, sort, reversed }
  
});