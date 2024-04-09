<template>
    <div>
        <h3>Common: {{ common }}%</h3>
        <h3>Rare: {{ rare }}%</h3>
        <h3>Epic: {{ epic }}%</h3>
        <h3>Legendary: {{ legendary }}%</h3>
        <h3>Godly: {{ godly }}%</h3>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';

type WeaponSkin = {
    displayIcon: string | null;
    displayName: string;
    levelsCount: number;
    wallpaper: string | null;
    rarity: string;
}

const props = defineProps({
    Skins: Array,
});

const allSkins: any = props.Skins?.map((item: any) => item.skins);
const combinedSkins: WeaponSkin[] = [].concat(...allSkins);

const common = ref<string> (((combinedSkins.filter((item) => item.rarity == "Common").length / combinedSkins.length) * 100).toFixed(2));
const rare = ref<string> (((combinedSkins.filter((item) => item.rarity == "Rare").length / combinedSkins.length) * 100).toFixed(2));
const epic = ref<string> (((combinedSkins.filter((item) => item.rarity == "Epic").length / combinedSkins.length) * 100).toFixed(2));
const legendary = ref<string> (((combinedSkins.filter((item) => item.rarity == "Legendary").length / combinedSkins.length) * 100).toFixed(2));
const godly = ref<string> (((combinedSkins.filter((item) => item.rarity == "Godly").length / combinedSkins.length) * 100).toFixed(2));

</script>

<style scoped>

</style>