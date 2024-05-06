import { ref } from "vue";
import { defineStore } from "pinia";
import type { SessionData } from "@/assets/types";

export const sessionStore = defineStore("session", () => {
  const session = ref<SessionData> ({
    access_token: "",
    refresh_token: "",
    token_type: "",
    authenticated: false,
    id: "",
    email: "",
    newPlayer: false
  });

  function changeSession (newSession: SessionData) {
    session.value = newSession;
  }

  return { session, changeSession }
  
});