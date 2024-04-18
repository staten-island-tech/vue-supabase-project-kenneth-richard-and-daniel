import { ref } from "vue";
import { defineStore } from "pinia";

type SessionData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  authenticated: boolean;
  id: string;
  email: string;
}

export const sessionStore = defineStore("session", () => {
  const session = ref<SessionData> ({
    access_token: "",
    refresh_token: "",
    token_type: "",
    authenticated: false,
    id: "",
    email: ""
  });

  return { session }
  
});