// @ts-check
/// <reference path="./types.d.ts" />

import { getData, getTodo, getTodoGroups, saveTodos } from './data.js';
import { sanitize } from './helpers.js';
import { getTodoGroupsTemplate, getTodosTemplate } from './renders.js';

/**
 * @param {Event} event 
 */
export function handleAddTodoGroup(event) {
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  const { title, description } = handleForm(form);
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
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  const { title, description } = handleForm(form);
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
    const todoList = document.querySelector(".todos__list");
    if (!todoList) return;
    todoList.insertAdjacentHTML("beforeend", getTodosTemplate({ ...group, todos: [newTodo] }));
  }
}

/**
 * @param {Event} event 
 */
export function handleEditTodo(event) {
  event.preventDefault();  
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  const { title, description, done } = handleForm(form)
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
 * @param {HTMLFormElement} form 
 */
export function handleForm(form) {
  const values = {};
  /** @type {NodeListOf<HTMLInputElement | HTMLSelectElement>} */
  const inputs = form.querySelectorAll('input[name],select[name]');
  inputs.forEach(input => {
    values[input.name] = sanitize(input.value);
    input.value = "";
  });
  return values;
}