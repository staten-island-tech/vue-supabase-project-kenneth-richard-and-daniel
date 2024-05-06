import router from "@/router";
import type { SessionData } from "./types";

export function delay (ms: number) {
    return new Promise((executor: any) => setTimeout(executor, ms));
}
  
export function getRandomIntInclusive (min: number, max: number): number {
    const minCeiled: number = Math.ceil(min);
    const maxFloored: number = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function formatDate (date: string): string {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const month = date[5] == "0" ? date[6] : date[5] + date[6];
    const day = date[8] == "0" ? date[9] : date[8] + date[9];
    const year = date[0] + date[1] + date[2] + date[3];
    
    return `${months[Number(month) - 1]} ${day}, ${year}`;
}

export function watchLogout (session: SessionData): void {
    if (session.access_token == "") {
        router.push({ path: "/" });
    }
}
