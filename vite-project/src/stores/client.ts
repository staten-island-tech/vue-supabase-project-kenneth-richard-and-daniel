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

  const fastSpin = ref<boolean> (false);
  const sort = ref<"rarity" | "count" | "date"> ("date");

  return { currentInventory, currentPity, currentWeapons, changePity, fastSpin, sort }
  
});