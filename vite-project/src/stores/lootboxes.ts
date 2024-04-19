
import type { ApiData, ApiSkin, ApiWeapon, NewWeapon, WeaponSkin } from "@/assets/types";

function checkSkin (name: string, img: string): boolean {
    if (name.includes("Standard")) {
        return false;
    } else if (name.includes("Random")) {
        return false;
    } else if (name == "Melee" || name == "Luxe Knife" || name == "Sovereign Marshal" || name == "Sovereign Guardian" || name == "Prime Guardian") {
        return false;
    }

    if (img == null) {
        return false;
    }
    return true;
}

function getRarity (weapon: ApiWeapon, skin: ApiSkin): string {
    let rarity: string = "";
    let levelsCount: number = skin.levels.length;

    if (skin.displayName == "VCT x SEN Classic") {
        return "Godly";
    }

    if (!weapon.shopData) {
        // means its a knife
        if (levelsCount >= 3) {
            return "Godly";
        } else if (levelsCount == 2) {
            return "Legendary"
        }
        return "Rare";
    }

    if (levelsCount == 5) {
        rarity = "Godly"
    } else if (levelsCount == 4) {
        rarity = "Epic";
    } else if (levelsCount == 3 || levelsCount == 2) {
        rarity = "Rare";
    } else if (levelsCount == 1) {
        rarity = "Common";
    }

    return rarity;
}

async function getSkins (): Promise<NewWeapon[]> {
    let data: ApiData = {
        status: 0,
        data: []
    };
    try {
        const response = await fetch(`https://valorant-api.com/v1/weapons`);
        data = await response.json();
    } catch (error) {
        console.warn(error);
    }

    const skinArray: NewWeapon[] = [];

    for (let weapon of data.data) {
        const obj: NewWeapon = {
            displayIcon: weapon.displayIcon,
            displayName: weapon.displayName,
            category: weapon.shopData ? weapon.shopData.category : null,
            cost: weapon.shopData ? weapon.shopData.cost : null,
            skins: [],
        };
        for (let skin of weapon.skins) {
            if (checkSkin(skin.displayName, skin.displayIcon) == true) {
                let skinRarity: string = getRarity(weapon, skin);

                const skinObj: WeaponSkin = {
                    defaultName: weapon.displayName,
                    category: weapon.shopData ? weapon.shopData.category : null,
                    displayIcon: skin.displayIcon,
                    displayName: skin.displayName,
                    levelsCount: skin.levels.length,
                    wallpaper: skin.wallpaper,
                    rarity: skinRarity,
                };
                obj.skins.push(skinObj);
            }
        }
        skinArray.push(obj);
    }

    return skinArray;
}

export { getSkins };
