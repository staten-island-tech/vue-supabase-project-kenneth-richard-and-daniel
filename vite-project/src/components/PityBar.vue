<template>
    <div id="progressBar">
      <div class="fillerBar"
      :style="{ width: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber))) * 100) + '%' }"
      :class="{ full: (Math.min(1, Math.max(0, (boxesSinceLast / pityNumber)))) == 1 }"></div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

// get supabase user data
// find how many boxes opened since last legendary/godly

const boxesSinceLast = ref<number> (10);
const pityNumber: number = 10;
const emit = defineEmits(["response"]);

if (boxesSinceLast.value >= pityNumber) {
    console.log(boxesSinceLast.value, pityNumber)
    emit("response", true);
};

</script>

<style scoped>

#progressBar {
  width: 90em;
  height: 3em;
  background-color: var(--lightContent);
  border-radius: 3em;
  margin-top: 1em;
  transition: all 0.5s;
}
#progressBar:hover {
  transform: scaleX(1.05);
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