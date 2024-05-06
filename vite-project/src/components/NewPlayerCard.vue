<template>
  <div class="itemCardMenu">
    <h2>We've given you <span>20 skins</span> to get you started!</h2>
    <h3>Enjoy the gambling experience!</h3>
    <button @click="closeCard" class="close">
      <img src="/check.svg" alt="Click to continue">
    </button>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(["close"]);

function closeCard (): void {
  emit("close");
}

</script>

<style scoped>

.itemCardMenu {
  min-width: 70em;
  max-width: 125em;
  padding: 5em;
  border-radius: 3vh;
  background-color: black;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 80%;
  min-height: 20%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: white;
  text-align: center;
}
.itemCardMenu h2, .itemCardMenu h3 {
  width: 90%;
  margin: 0;
}
.itemCardMenu h2 {
  font-size: 3em;
}
.itemCardMenu h2 span {
  color: var(--cyan);
}
.itemCardMenu h3 {
  color: var(--gold);
}

.close {
  background-color: var(--deepGreen);
  width: 10em;
  height: 7em;
  border-radius: 2em;
  padding-top: 4em;
  padding-bottom: 4em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3em;
  transition: all 0.5s;
}
.close img {
  width: 6em;
  height: 6em;
}

@media screen and (max-width: 1200px) {
  .itemCardMenu {
    min-width: unset;
    max-width: unset;
    max-height: 90%;
    width: 75vw;
  }
}

@media screen and (max-width: 800px) {
  .itemCardMenu {
    min-height: 55%;
    width: 95vw;
    padding: 1vw;
    justify-content: center;
    gap: 1vh;
  }
}

@media (pointer: coarse) {
  .close {
    width: 75%;
    border-radius: 5em;
    background-color: #5cff33;
  }
}

@media (hover: hover) and (pointer: fine) {
  .close:hover {
    background-color: #5cff33;
    border-radius: 5em;
    width: 75%;
  }
}

</style>