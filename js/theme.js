// @ts-check
/// <reference path="./types.d.ts" />

import {moonIcon, sunIcon} from "./icons.js";

function getTheme() {
  function getSystemTheme() {
    if (!window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return localStorage.getItem("theme") || getSystemTheme();
}

function themeToggle() {
  const theme = getTheme();
  const newTheme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  document.body.classList.remove(theme);
  document.body.classList.add(newTheme);
}

function renderThemeToggle() {
  document.body.addEventListener("click", (e) => {
    const themeBtn = e.target.closest(".theme-toggle__button");
    if (themeBtn) {
      themeToggle();
    }
  });
  return `
    <div class="theme-toggle">
      <button class="theme-toggle__button">
        ${moonIcon()}
        ${sunIcon()}
      </button>
    </div>
  `;
}

export function initTheme() {
  document.body.classList.add(getTheme());
  const container = document.querySelector(".container");
  if (!container) return;
  container.insertAdjacentHTML("beforeend", renderThemeToggle());
}