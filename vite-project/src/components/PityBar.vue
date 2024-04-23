<template>
    <div id="progressBar">
      <div class="fillerBar"
      :style="{ width: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber))) * 100) + '%' }"
      :class="{ full: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber)))) == 1 }"></div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { sessionStore } from '@/stores/session';
import { clientStore } from '@/stores/client';

const boxesSinceLast = ref<number> (0);
const pityNumber: number = 15;

watch(() => clientStore().currentPity, (newPity: number) => {
  boxesSinceLast.value = newPity;
});

onMounted(async () => {
  getData();
});

async function getData (): Promise<void> {
    try {
        const { data, error } = await supabase.from('profiles').select()
        if (error) throw error;

        boxesSinceLast.value = data.find((user) => user.id == sessionStore().session.id).boxes_since_last;

    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    }
}

</script>

<style scoped>

#progressBar {
  width: 90em;
  height: 3em;
  background-color: var(--lightContent);
  border-radius: 3em;
  margin-top: 4em;
  transition: all 0.5s;
}

.fillerBar {
  height: 100%;
  background: linear-gradient(to right, #ff9100, #f2a83a, #ff9100);
  border-radius: 3em;
  transition: all 0.4s ease-in-out;
}

.full {
  background: linear-gradient(to right, #7700ff, #b23af2, #7700ff);
}

</style>