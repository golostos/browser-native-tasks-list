// @ts-check
/// <reference path="./types.d.ts" />

import { getData, getFakeTodosForUser, getGroup, getTodo, getTodoGroups, saveTodos } from './data.js';
import { Maybe, sanitize } from './helpers.js';
import { getTodoGroupsTemplate, getTodosTemplate } from './renders.js';

/**
 * @param {Event} event 
 */
export function handleAddTodoGroup(event) {
  const { values: { title, description } } = handleForm(event)
  if (title && description) {
    const todos = getTodoGroups();
    const newGroup = {
      id: todos.length + 1,
      title,
      description,
      todos: [],
    };
    todos.push(newGroup);
    saveTodos(todos);
    const groupsList = document.querySelector(".groups__list");
    if (!groupsList) return;
    groupsList.insertAdjacentHTML("beforeend", getTodoGroupsTemplate([newGroup]));
  }
}

/**
 * @param {Event} event 
 */
export function handleAddTodo(event) {
  const { values: { title, description }, form } = handleForm(event)
  if (title && description) {
    const groupId = form.closest(".todos")?.dataset?.groupId;
    const { todos, group } = getData({ groupId });
    if (!group) return;
    const newTodo = {
      id: group.todos.length + 1,
      title,
      description,
      done: false,
      groupId
    };
    group.todos.push(newTodo);
    saveTodos(todos);
    // check todo-filter
    const todoFilter = document.querySelector("#todo-filter");
    if (todoFilter instanceof HTMLSelectElement && todoFilter.value === "true") return;
    const todoList = document.querySelector(".todos__list");
    if (!todoList) return;
    todoList.insertAdjacentHTML("beforeend", getTodosTemplate({ ...group, todos: [newTodo] }));
  }
}

/**
 * @param {Event} event 
 */
export function handleEditTodo(event) {
  const { values: { title, description, done }, form } = handleForm(event)
  const groupId = Number(form.dataset.groupId)
  const todoId = Number(form.dataset.todoId)
  const todo = getTodo({ groupId, todoId });
  if (!todo) return;
  todo.title = title;
  todo.description = description;
  todo.done = done === 'true'
  saveTodos();
  window.location.hash = `#/todos/${groupId}`
}

/**
 * @param {Event} event 
 */
export function handleEditGroup(event) {
  const { values: { title, description }, form } = handleForm(event)
  const groupId = Number(form.dataset.groupId)
  const group = getTodoGroups().find(group => group.id === groupId);
  if (!group) return;
  group.title = title;
  group.description = description;
  saveTodos();
  window.location.hash = `#/todos/${groupId}`
}

/**
 * @param {Event} event 
 * @param {Function?} callback
 */
export async function handleGetFakeTodos(event, callback) {
  const { values: { userId }, form } = handleForm(event)
  const groupId = Number(form.dataset.groupId)
  Maybe.of(await getFakeTodosForUser(Number(userId)))
    .bind(todos => todos.map(todo => ({ ...todo, groupId })))
    .do(todos => {
      const group = getGroup({ id: groupId });
      if (!group) return null;
      group.todos = group.todos.concat(todos);
      saveTodos();
      if (callback) callback();
      Maybe.of(document.querySelector("#todo-filter"))
        .bind(filter => filter instanceof HTMLSelectElement ? filter.value : null)
        .bind(filter => todos.filter(todo => filter === 'all' || String(todo.done) === filter))
        .do(todos => {
          const todoList = document.querySelector(".todos__list");
          if (!todoList) return null;
          todoList.insertAdjacentHTML("beforeend", getTodosTemplate({ ...group, todos }));
        })
    })
}

/**
 * @param {Event} event 
 */
export function handleForm(event) {
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) throw new Error("form is not an instance of HTMLFormElement");
  /** @type {{[key: string]: string}} */
  const values = {};
  /** @type {NodeListOf<HTMLInputElement | HTMLSelectElement>} */
  const inputs = form.querySelectorAll('input[name],select[name]');
  inputs.forEach(input => {
    values[input.name] = sanitize(input.value);
    input.value = "";
  });
  return { values, form };
}