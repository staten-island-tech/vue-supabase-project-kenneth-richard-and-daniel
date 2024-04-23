<template>
    <div v-if="loaded && session && session.access_token != ''" class="inventory">
        <div v-for="item in inventory" class="inventoryItem" :class="{ common: item.rarity == 'Common', rare: item.rarity == 'Rare', epic: item.rarity == 'Epic', legendary : item.rarity == 'Legendary', godly: item.rarity == 'Godly' }">
            <h2>{{ item.displayName }}</h2>
            <img :src="item.displayIcon" alt="">
            <h3>x{{ item.inventoryCount }}</h3>
        </div>

        <div v-if="inventory.length == 0" class="wompwomp">
            <h2>You don't have any items D:</h2>
            <h3>Open some boxes to get started!</h3>
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

type ApiData = {
    id: string;
    skin_name: string;
}

const session = ref<any> ();
const loaded = ref<boolean> (false);
const inventory = ref<any> ([]);

watch(() => sessionStore().session, (newSession) => {
  session.value = newSession;
});

onMounted(async () => {
    session.value = sessionStore().session;
    loaded.value = false;
    inventory.value = clientStore().currentInventory;
    getInventory();
});

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
        } else {
            inventoryTranslated.push(found);
        }
    }
    
    inventory.value = inventoryTranslated;
    clientStore().currentInventory = inventoryTranslated;

    loaded.value = true;
}

async function getData (): Promise<ApiData[]> {
    let apiData: ApiData[] = [{
        id: "",
        skin_name: ""
    }];
    try {
        const { data, error } = await supabase.from('inventory').select()
        if (error) throw error;

        apiData = data.filter((item) => item.id == sessionStore().session.id);

    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    }

    return apiData;
}

</script>

<style scoped>

.wompwomp {
  background-color: #ff5050;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
  border-radius: 5em;
}

.inventory {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5%;
  width: 90%;
  margin-top: 4em;
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