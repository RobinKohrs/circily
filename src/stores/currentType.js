import { writable } from "svelte/store";

// Create a writable store with an initial value of an empty string
export const typeStore = writable(["all"]);
