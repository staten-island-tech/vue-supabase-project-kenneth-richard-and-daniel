<template>
    <div v-for="skin in props.Wheel" class="rarity" :class="skin.rarity[0].toLowerCase() + skin.rarity.slice(1)">
        <h3>{{ skin.rarity }}<span>: {{ getRarity(skin.rarity) }}%</span></h3>
    </div>
</template>

<script setup lang="ts">

import type { WeaponSkin } from '@/assets/types';
import { ref, onMounted } from 'vue';

type Props = {
    Skins: WeaponSkin[];
    Current: WeaponSkin;
    Wheel: WeaponSkin[];
}

const props = defineProps<Props>();

const combinedSkins: WeaponSkin[] = props.Skins;

const common = ref<string> (((combinedSkins.filter((item) => item.rarity == "Common").length / combinedSkins.length) * 100).toFixed(2));
const rare = ref<string> (((combinedSkins.filter((item) => item.rarity == "Rare").length / combinedSkins.length) * 100).toFixed(2));
const epic = ref<string> (((combinedSkins.filter((item) => item.rarity == "Epic").length / combinedSkins.length) * 100).toFixed(2));
const legendary = ref<string> (((combinedSkins.filter((item) => item.rarity == "Legendary").length / combinedSkins.length) * 100).toFixed(2));
const godly = ref<string> (((combinedSkins.filter((item) => item.rarity == "Godly").length / combinedSkins.length) * 100).toFixed(2));

function getRarity (rarity: string): string {
    let returnRarity: string = "";
    
    if (rarity == "Common") {
        returnRarity = common.value;
    } else if (rarity == "Rare") {
        returnRarity = rare.value;
    } else if (rarity == "Epic") {
        returnRarity = epic.value;
    } else if (rarity == "Legendary") {
        returnRarity = legendary.value;
    } else if (rarity == "Godly") {
        returnRarity = godly.value;
    }
    
    return returnRarity;
}

</script>

<style scoped>

.rarity {
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.05s;
    border-radius: 2em;
    width: 18em;
}
.rarity h3 {
    font-size: var(--h3);
    margin: 0;
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

.gray {
    background-color: transparent;
    background: 0;
    color: transparent;
}

@media screen and (max-width: 1200px) {
    .rarity {
        width: 11em;
    }
    .rarity h3 span {
        display: none;
    }
}

</style>