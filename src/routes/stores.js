import { writable } from "svelte/store";
import { browser } from '$app/environment';

export const themeColorLeft = writable(browser ? (localStorage.getItem("themeColorLeft") || "#0a0a0a") : "#0a0a0a");
themeColorLeft.subscribe((val) => {
    if (browser) {
        localStorage.setItem("themeColorLeft", val);
    }
});

export const themeColorRight = writable(browser ? (localStorage.getItem("themeColorRight") || "#467465") : "#467465");
themeColorRight.subscribe((val) => {
    if (browser) {
        localStorage.setItem("themeColorRight", val);
    }
});
