// @ts-check
/// <reference path="./types.d.ts" />

import { getFakeTodosForUser, getGroup, getTodo, getTodoGroups, saveTodos } from './data.js';
import { events, initDispatchEvent, on } from './events.js';
import { Maybe, compose, getFullHeightOfChildren } from './helpers.js';
import { doneIcon, hideIcon, progressIcon, showIcon } from './icons.js';
import { getTodosTemplate } from './renders.js';

export function handleDropdown(event) {
  const dropdown = event.target.closest(".dropdown");
  if (dropdown && event.target.closest("#dropdown__action-button")) {
    dropdown.classList.toggle("dropdown_open");
  } else {
    document.querySelectorAll(".dropdown").forEach(dropdown => {
      dropdown.classList.remove("dropdown_open");
    });
  }
}

export function handleToggleFormVisible(event) {
  /** @type {HTMLFormElement | null} */
  const form = document.querySelector(".create-form");
  const minimizeButton = event.target.closest("#minimize-button");
  if (form && minimizeButton) {
    const formHeight = form.offsetHeight;
    form.style.height = formHeight > 0 ? '0' : getFullHeightOfChildren(form) + "px";
    minimizeButton.innerHTML = parseInt(form.style.height) > 0
      ? 'Hide ' + hideIcon() : 'Show ' + showIcon();
  }
}

export const handleClick = compose(
  handleDropdown,
  handleToggleFormVisible,
)

// These handler functions below run by custom events

/**
 * 
 * @param {ShowEditGroupFormParams} params
 */
function handleShowEditGroupForm({ groupId }) {
  // history.pushState(null, '', `#/todos/edit?groupId=${groupId}&todoId=${todoId}`);
  window.location.hash = `#/todos/${groupId}/edit`;
}

/**
 * 
 * @param {ShowEditTodoFormParams} params
 */
function handleShowEditTodoForm({ groupId, todoId }) {
  // history.pushState(null, '', `#/todos/edit?groupId=${groupId}&todoId=${todoId}`);
  window.location.hash = `#/todos/${groupId}/${todoId}/edit`;
}

/**
 * 
 * @param {ToggleTodoParams} details 
 * @returns 
 */
function handleToggleTodo({ groupId, todoId }) {
  const todo = getTodo({ groupId, todoId });
  if (!todo) return;
  todo.done = !todo.done;
  saveTodos();
  Maybe.of(document.querySelector(`.todo[data-id="${todoId}"]`))
    .bind(todoElement => todoElement.querySelector(".todo__title"))
    .do(subtitle => subtitle.classList.toggle("todo-title_done"))
    .bind(() => document.querySelector(`.todo[data-id="${todoId}"] .status__text`))
    .do(status => status.innerHTML = todo.done ? `${doneIcon()} Done` : `${progressIcon()} In progress`)
}

/**
 * 
 * @param {RemoveTodoParams} details 
 */
function handleRemoveTodo({ groupId, todoId }) {
  if (!confirm("Are you sure?")) return;
  Maybe.of(getGroup({ id: groupId }))
    .do(group => group.todos = group.todos.filter(todo => todo.id !== Number(todoId)))
    .do(() => saveTodos())
    .bind(() => document.querySelector(`.todo[data-id="${todoId}"]`))
    .do(todoElement => todoElement.remove());
}

/**
 * 
 * @param {RemoveGroupParams} details 
 */
function handleRemoveGroup({ groupId }) {
  if (!confirm("Are you sure?")) return;
  Maybe.of(getTodoGroups())
    .bind(groups => groups.filter(group => group.id !== Number(groupId)))
    .do(groups => saveTodos(groups))
    .bind(() => document.querySelector(`.group[data-id="${groupId}"]`))
    .do(groupElement => groupElement.remove())
    .catch(() => window.location.hash = "");
}

function handleRemoveAllGroups() {
  if (!confirm("Are you sure?")) return;
  saveTodos([]);
  Maybe.of(document.querySelector(".groups__list"))
    .do(groupList => groupList.innerHTML = "");
}

/**
 * 
 * @param {RemoveAllTodosParams} details 
 */
function handleRemoveAllTodos({ groupId }) {
  if (!confirm("Are you sure?")) return;
  Maybe.of(getGroup({ id: groupId }))
    .do(group => group.todos = [])
    .do(() => saveTodos())
    .bind(() => document.querySelector(".todos__list"))
    .do(todoList => todoList.innerHTML = "");
}

/**
 * 
 * @param {GetFakeTodosParams} details 
 */
async function handleGetFakeTodos({ groupId, userId }) {
  Maybe.of(await getFakeTodosForUser(userId))
    .bind(todos => todos.map(todo => ({ ...todo, groupId })))
    .do(todos => {
      const group = getGroup({ id: groupId });
      if (!group) return null;
      group.todos = group.todos.concat(todos);
      saveTodos();
      const todoList = document.querySelector(".todos__list");
      if (!todoList) return null;
      todoList.insertAdjacentHTML("beforeend", getTodosTemplate({ ...group, todos }));
    })
}

export function initCustomEvents() {
  initDispatchEvent();
  // on(events.editGroup, handleEditGroup);
  on(events.toggleTodo, handleToggleTodo);
  on(events.removeTodo, handleRemoveTodo);
  on(events.removeGroup, handleRemoveGroup);
  on(events.removeAllGroups, handleRemoveAllGroups);
  on(events.removeAllTodos, handleRemoveAllTodos);
  on(events.getFakeTodos, handleGetFakeTodos);
  on(events.showEditGroupForm, handleShowEditGroupForm);
  on(events.showEditTodoForm, handleShowEditTodoForm);
}