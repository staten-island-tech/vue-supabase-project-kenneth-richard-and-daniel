<template>
    <div class="rarity">
        <h3 class="common" :class="{ gray: props.Current.rarity != 'Common' }">Common: {{ common }}%</h3>
    </div>
    <div class="rarity">
        <h3 class="rare" :class="{ gray: props.Current.rarity != 'Rare' }">Rare: {{ rare }}%</h3>
    </div>
    <div class="rarity">
        <h3 class="epic" :class="{ gray: props.Current.rarity != 'Epic' }">Epic: {{ epic }}%</h3>
    </div>
    <div class="rarity">
        <h3 class="legendary" :class="{ gray: props.Current.rarity != 'Legendary' }">Legendary: {{ legendary }}%</h3>
    </div>
    <div class="rarity">
        <h3 class="godly" :class="{ gray: props.Current.rarity != 'Godly' }">Godly: {{ godly }}%</h3>
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
    Current: Object,
});

console.log(props.Current)

const allSkins: any = props.Skins?.map((item: any) => item.skins);
const combinedSkins: WeaponSkin[] = [].concat(...allSkins);

const common = ref<string> (((combinedSkins.filter((item) => item.rarity == "Common").length / combinedSkins.length) * 100).toFixed(2));
const rare = ref<string> (((combinedSkins.filter((item) => item.rarity == "Rare").length / combinedSkins.length) * 100).toFixed(2));
const epic = ref<string> (((combinedSkins.filter((item) => item.rarity == "Epic").length / combinedSkins.length) * 100).toFixed(2));
const legendary = ref<string> (((combinedSkins.filter((item) => item.rarity == "Legendary").length / combinedSkins.length) * 100).toFixed(2));
const godly = ref<string> (((combinedSkins.filter((item) => item.rarity == "Godly").length / combinedSkins.length) * 100).toFixed(2));

</script>

<style scoped>

.rarity h3 {
    font-size: var(--h3);
    margin: 0;
}

.common {
    color: var(--common);
}
.rare {
    color: var(--rare);
}
.epic {
    color: var(--epic);
}
.legendary {
    color: var(--legendary);
}
.godly {
    color: transparent;
    background-image: var(--godlyText);
    background-clip: text;
    width: fit-content;
}

.gray {
    filter: grayscale(1);
}

</style>