import { ref } from "vue";
import { defineStore } from "pinia";
import type { Inventory } from "@/assets/types";

export const clientStore = defineStore("client", () => {
  const currentInventory = ref<Inventory> ([]);
  const currentPity = ref<number> (0);

  function changePity (newPity: number) {
    currentPity.value = newPity;
  }

  const fastSpin = ref<boolean> (false);

  return { currentInventory, currentPity, changePity, fastSpin }
  
});