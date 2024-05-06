
export type ApiData = {
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

export type ApiWeapon = {
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

export type ApiSkin = {
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

export type NewWeapon = {
    displayIcon: string;
    displayName: string;
    category: string | null;
    cost: number | null;
    skins: WeaponSkin[];
}

export type WeaponSkin = {
    defaultName: string;
    category: string | null;
    displayIcon: string | undefined;
    displayName: string;
    levelsCount: number;
    wallpaper: string | null;
    rarity: string;
    inventoryCount: number;
    date: string;
}

export type SessionData = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    authenticated: boolean;
    id: string;
    email: string | undefined;
    newPlayer: boolean;
}

export type Inventory = WeaponSkin[];
