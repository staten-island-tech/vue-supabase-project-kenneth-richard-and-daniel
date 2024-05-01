<template>
    <div>
        <h3 id="woah">sup</h3>
        <div class="tings" v-if="clicked">

        </div>
        <div class="button">
            <button class="create" @click="makeappear">Create a Trade Request</button>
        </div>
    </div>
</template>

<script setup lang="ts">

function makeappear(){

}

</script>

<style scoped>
#woah {
    margin-top: 19em;
}
</style>