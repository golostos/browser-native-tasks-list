// @ts-check
/// <reference path="./types.d.ts" />

import { partial, toJson } from './helpers.js';

export function initDispatchEvent() {
  /**
   * 
   * @param {string} eventName 
   * @param {Record<string, any>} [detail] 
   */
  function dispatchEvent(eventName, detail = {}) {
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
  showGetFakeTodos: "show-get-fake-todos",
  showEditTodoForm: "show-edit-todo-form",
  showEditGroupForm: "show-edit-group-form",
  groupHasNoTodos: "group-has-no-todos",
  filterTodos: "filter-todos",
};

/**
 * @param {string} eventName
 * @param {any} details
 */
export function baseDispatch(eventName, details) {
  return `window.dispatch?.call(null, '${eventName}', ${toJson(details)})`
}

/** @type {(details: ToggleTodoParams) => void} */
export const dispatchToggleTodo = partial(baseDispatch, events.toggleTodo);

/** @type {(details: RemoveTodoParams) => void} */
export const dispatchRemoveTodo = partial(baseDispatch, events.removeTodo);

/** @type {(details: RemoveGroupParams) => void} */
export const dispatchRemoveGroup = partial(baseDispatch, events.removeGroup);

export const dispatchRemoveAllGroups = partial(baseDispatch, events.removeAllGroups);

/** @type {(details: RemoveAllTodosParams) => void} */
export const dispatchRemoveAllTodos = partial(baseDispatch, events.removeAllTodos);

/** @type {(details: ShowGetFakeTodosParams) => void} */
export const dispatchShowGetFakeTodos = partial(baseDispatch, events.showGetFakeTodos);

/** @type {(details: ShowEditTodoFormParams) => void} */
export const dispatchShowEditTodoForm = partial(baseDispatch, events.showEditTodoForm);

/** @type {(details: ShowEditGroupFormParams) => void} */
export const dispatchShowEditGroupForm = partial(baseDispatch, events.showEditGroupForm);
