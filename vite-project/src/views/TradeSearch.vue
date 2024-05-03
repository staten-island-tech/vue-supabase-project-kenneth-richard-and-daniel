<template>
    <div class="renameThisLaterOrDeleteIDK">
        <div id="trade-box">
            <h3>Trade Requests Avaliable</h3>
        </div>
        <div class="tings" v-if="clicked">
            <label for="bombaclad">Select Weapon Your Trading</label>
            <input type="text" id="bombaclad">
        </div>
        <div class="button">
            <button class="create" @click="makeappear">Create a Trade Request</button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const clicked = ref(false);

function makeappear(){
 clicked.value = true;
}

</script>

<style scoped>

.renameThisLaterOrDeleteIDK {
    margin-top: 19em;
    /* remember to put the margin-top 19em in whatever ur highest element is gonna be */
}

#woah {
    margin-top: 14em;
    background-color: rgb(6, 146, 99);
    border-radius: 15px;
}
</style>