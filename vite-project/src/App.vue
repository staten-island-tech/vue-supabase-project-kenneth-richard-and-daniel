<template>
  <header>
    <nav>
      <RouterLink to="/"><h3>Lootboxes</h3></RouterLink>
      <RouterLink to="/inventory"><h3>Inventory</h3></RouterLink>
    </nav>
  </header>

  <RouterView/>

</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>

</style>