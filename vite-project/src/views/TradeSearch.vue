<template>
  <div class="createTrade">
    <button @click="tradeActive = !tradeActive">Create trade</button>
  </div>

  <Transition name="createTradeTransition">
    <div class="createTradeMenu" v-if="tradeActive">
      <h2>Create a trade</h2>
      <h3>You are giving:</h3>
      <div class="giving">
        <button>
          <h3>Add an item</h3>
        </button>
        <div class="card" v-for="item in currentGive">
          <img :src="item.displayIcon" :alt="'Image of ' + item.displayName">
        </div>
      </div>
      <h3>You want:</h3>
      <div class="giving">
        <button>
          <h3>Add an item</h3>
        </button>
        <div class="card" v-for="item in currentWant">
          <img :src="item.displayIcon" :alt="'Image of ' + item.displayName">
        </div>
      </div>
    </div>
  </Transition>

  <div class="tradeMenu">
    <div class="trade" v-for="trade in currentTrades">
      <h2>Trade Offer</h2>
      <p>Created {{ formatDate(trade.date) }}</p>
      <h3>You give:</h3>
      <div class="giving">
        <div class="card" v-for="itemName in trade.items_want">
          <img :src="weapons?.find((item) => item.displayName == itemName)?.displayIcon">
        </div>
      </div>
      <h3>You receive:</h3>
      <div class="giving">
        <div class="card" v-for="itemName in trade.items_give">
          <img :src="weapons?.find((item) => item.displayName == itemName)?.displayIcon">
        </div>
      </div>
      <p>Trade ID {{ trade.trade_id }}</p>
      <button>Accept trade</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';
import { clientStore } from '@/stores/client';
import { onMounted, ref, watch } from 'vue';
import type { Trade, WeaponSkin } from '@/assets/types';
import { formatDate } from '@/assets/functions';
import { getSkins } from '@/stores/lootboxes';

const currentTrades = ref<Trade[]> ();
const weapons = ref<WeaponSkin[]> ();

const tradeActive = ref(false);
const currentGive = ref<WeaponSkin[]> ();
const currentWant = ref<WeaponSkin[]> ();

watch(() => clientStore().currentTrades, (newTrades) => currentTrades.value = newTrades);

onMounted(async () => {
  const trades = await getData();
  if (trades) currentTrades.value = trades;

  weapons.value = clientStore().currentWeapons.map((item) => item.skins).flat();
  try {
    const skins = await getSkins();
    weapons.value = skins.map((item) => item.skins).flat();
    clientStore().currentWeapons = skins;
  } catch (error) {
    console.warn(error);
  }
});

async function getData () {
    try {
        const { data, error } = await supabase.from('trades').select()
        if (error) throw error;
        return data as Trade[];
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    }
}

function createTrade () {

}

</script>

<style lang="scss" scoped>

</style>