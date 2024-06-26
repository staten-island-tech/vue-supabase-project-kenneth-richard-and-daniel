import { ref } from "vue";
import { defineStore } from "pinia";
import type { NewWeapon, Inventory, Trade } from "@/assets/types";

export const clientStore = defineStore("client", () => {
  const currentInventory = ref<Inventory> ([]);
  const currentPity = ref<number> (0);
  const currentWeapons = ref<NewWeapon[]>([]);
  const selectedItems = ref<Inventory> ([]);
  const selectedInventory = ref<Inventory> ([]);

  function changePity (newPity: number): void {
    currentPity.value = newPity;
  }

  function changeInventory (newInventory: Inventory): void {
    currentInventory.value = newInventory;
  }

  const fastSpin = ref<boolean> (false);
  const sort = ref<"rarity" | "weapon" | "date"> ("date");
  const reversed = ref<boolean> (false);
  const hidden = ref<boolean> (false);

  function changeHidden (): void {
    hidden.value = !hidden.value;
  }

  const intendedRoute = ref<string> ("");
  const currentTrades = ref<Trade[]> ([]);

  return { currentInventory, currentPity, currentWeapons, changePity, changeInventory, fastSpin, sort, reversed, hidden, changeHidden,
    intendedRoute, selectedItems, selectedInventory, currentTrades }
  
});