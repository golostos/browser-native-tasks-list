// @ts-check

import { partial, toJson } from './helpers.js';

export function initDispatchEvent() {
  function dispatchEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
  window.dispatch = dispatchEvent;
}

export function on(eventName, callback) {
  document.addEventListener(eventName, (event) => {
    callback(event.detail);
  });
}

export const events = {
  toggleTodo: "toggle-todo",
  removeTodo: "remove-todo",
  removeGroup: "remove-group",
  removeAllGroups: "remove-all-groups",
  removeAllTodos: "remove-all-todos",
  getFakeTodos: "get-fake-todos",
  showEditTodoForm: "show-edit-todo-form",
};

export function onBase(eventName, details) {
  return `dispatch('${eventName}', ${toJson(details)})`
}

/** @type {(details: ToggleTodoParams) => void} */
export const onToggleTodo = partial(onBase, events.toggleTodo);

/** @type {(details: RemoveTodoParams) => void} */
export const onRemoveTodo = partial(onBase, events.removeTodo);

export const onRemoveGroup = partial(onBase, events.removeGroup);

export const onRemoveAllGroups = partial(onBase, events.removeAllGroups);

/** @type {(details: RemoveAllTodosParams) => void} */
export const onRemoveAllTodos = partial(onBase, events.removeAllTodos);

/** @type {(details: GetFakeTodosParams) => void} */
export const onGetFakeTodos = partial(onBase, events.getFakeTodos);

/** @type {(details: ShowEditTodoFormParams) => void} */
export const onShowEditTodoForm = partial(onBase, events.showEditTodoForm);
