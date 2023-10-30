// @ts-check
/// <reference path="./types.d.ts" />

import { getGroup, getTodo, getTodoGroupById } from './data.js';
import { handleClick, handleSubmit, initCustomEvents } from './handlers.js';
import { Maybe } from './helpers.js';
import { renderGroups, renderTodos, renderNotFound, renderEditTodoForm } from './renders.js';
import {initTheme} from "./theme.js";

const stylesLink = document.createElement("link");
stylesLink.rel = "stylesheet";
stylesLink.href = "css/index.css";
document.head.append(stylesLink);

document.addEventListener("DOMContentLoaded", start);

function start() {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div class="container">
      <div class="content">
        ${router()}
      </div>
    </div>`
  root.addEventListener("submit", handleSubmit);
  root.addEventListener("click", handleClick);
  initTheme()
  initCustomEvents()
}

window.addEventListener("hashchange", () => {
  const container = document.querySelector(".content");
  if (!container) return;
  container.innerHTML = router();
});

function router() {
  const hash = window.location.hash;
  switch (true) {
    case hash === "":
      return renderGroups();
    case /^#\/todos\/\d+\/edit\/\d+/.test(hash):
      return Maybe.of(hash.match(/^#\/todos\/(\d+)\/edit\/(\d+)/))
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