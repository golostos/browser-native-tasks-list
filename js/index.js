// @ts-check
/// <reference path="./types.d.ts" />

import { getGroup, getTodo, getTodoGroupById } from './data.js';
import { handleClick, initCustomEvents } from './event-handlers.js';
import { Maybe, fixHeightForm } from './helpers.js';
import { renderGroups, renderTodos, renderNotFound, renderEditTodoForm, renderEditGroupForm } from './renders.js';
import {initTheme} from "./theme.js";

const stylesLink = document.createElement("link");
stylesLink.rel = "stylesheet";
stylesLink.href = "css/index.css";
document.head.append(stylesLink);

document.addEventListener("DOMContentLoaded", start);

function start() {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = /*html*/`
    <div class="container">
      <div class="content"></div>
    </div>` 
  const container = document.querySelector(".content");
  if (!container) return;
  container.replaceChildren(router());
  root.addEventListener("click", handleClick);
  initTheme()
  initCustomEvents()
  fixHeightForm()
}

window.addEventListener("hashchange", () => {
  const container = document.querySelector(".content");
  if (!container) return;
  container.replaceChildren(router());
  fixHeightForm()
});

function router() {
  const hash = window.location.hash;
  switch (true) {
    case hash === "":
      return renderGroups();
    case /^#\/todos\/\d+\/edit/.test(hash):
      return Maybe.of(hash.match(/^#\/todos\/(\d+)\/edit/))
        .bind(([, groupId]) => getGroup({
          id: Number(groupId)
        }))
        .bind(group => renderEditGroupForm(group))
        .catch(() => renderNotFound())
        .get();
    case /^#\/todos\/\d+\/\d+\/edit/.test(hash):
      return Maybe.of(hash.match(/^#\/todos\/(\d+)\/(\d+)\/edit/))
        .bind(([, groupId, todoId]) => getTodo({
          groupId: Number(groupId),
          todoId: Number(todoId),
        }))
        .bind(todo => renderEditTodoForm(todo))
        .catch(() => renderNotFound())
        .get();
    case hash.startsWith("#/todos/"):
      const id = hash.split("/")[2];
      const group = getTodoGroupById(id);
      if (group) return renderTodos(group);
      return renderNotFound();
    default:
      return renderNotFound();
  }
}