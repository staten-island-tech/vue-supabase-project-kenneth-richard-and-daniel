
type ApiData = {
    status: number;
    data: {
        assetPath: string;
        category: string;
        defaultSkinUuid: string;
        displayIcon: string;
        displayName: string;
        killStreamIcon: string;
        shopData: {
            assetPath: string;
            canBeTrashed: boolean;
            category: string;
            categoryText: string;
            cost: number;
            gridPosition: object;
            image: string | null;
            newImage: string | null;
            newImage2: string | null;
            shopOrderPriority: number | null;
        };
        skins: {
            assetPath: string;
            chromas: object[];
            contentTierUuid: string;
            displayIcon: string;
            displayName: string;
            levels: object[];
            themeUuid: string;
            uuid: string;
            wallpaper: string | null;
        }[];
        uuid: string;
        weaponStats: object;
    }[];
}

type ApiWeapon = {
    assetPath: string;
    category: string;
    defaultSkinUuid: string;
    displayIcon: string;
    displayName: string;
    killStreamIcon: string;
    shopData: {
        assetPath: string;
        canBeTrashed: boolean;
        category: string;
        categoryText: string;
        cost: number;
        gridPosition: object;
        image: string | null;
        newImage: string | null;
        newImage2: string | null;
        shopOrderPriority: number | null;
    };
    skins: ApiSkin[];
    uuid: string;
    weaponStats: object;
}

type ApiSkin = {
    assetPath: string;
    chromas: object[];
    contentTierUuid: string;
    displayIcon: string;
    displayName: string;
    levels: object[];
    themeUuid: string;
    uuid: string;
    wallpaper: string | null;
}

type NewWeapon = {
    displayIcon: string;
    displayName: string;
    category: string | null;
    cost: number | null;
    skins: WeaponSkin[];
}

type WeaponSkin = {
    displayIcon: string | null;
    displayName: string;
    levelsCount: number;
    wallpaper: string | null;
    rarity: string;
}

function checkSkin (name: string, img: string): boolean {
    if (name.includes("Standard")) {
        return false;
    } else if (name.includes("Random")) {
        return false;
    } else if (name == "Melee" || name == "Luxe Knife" || name == "Sovereign Marshal" || name == "Sovereign Guardian") {
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

async function getSkins () {
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

    // console.log(skinArray);

    return skinArray;
}

export { getSkins };
