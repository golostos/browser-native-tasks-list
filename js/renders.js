// @ts-check
/// <reference path="./types.d.ts" />

import { getTodoGroups } from './data.js';
import { observeList } from './event-handlers.js';
import { dispatchShowGetFakeTodos, dispatchRemoveAllGroups, dispatchRemoveAllTodos, dispatchRemoveGroup, dispatchRemoveTodo, dispatchShowEditGroupForm, dispatchShowEditTodoForm, dispatchToggleTodo } from './events.js';
import { handleAddTodo, handleAddTodoGroup, handleEditGroup, handleEditTodo } from './form-handlers.js';
import { Maybe, fragment } from './helpers.js';
import { addIcon, backIcon, doneIcon, downloadIcon, editIcon, showIcon, progressIcon, removeIcon, hideIcon, homeIcon } from "./icons.js";

export function renderNotFound() {
  return fragment/*html*/`
    <h1 class="title container__title">PAGE NOT FOUND</h1>
  `;
}

export function renderGroups() {
  const groups = getTodoGroups();
  const page = fragment/*html*/`
    <div class="groups">
      <div class="header">
        <h1 class="title header__title">Groups of todos</h1>
        <div class="header__toolbar toolbar">
          <button class="button button_danger" onclick="${dispatchRemoveAllGroups()}">
            ${removeIcon()}
            Remove all
          </button>
          <button class="button button_secondary toolbar__hide-button" id="minimize-button">
            ${document.querySelector(".create-form")?.offsetHeight > 0 || groups.length === 0
      ? 'Hide ' + hideIcon() : 'Show ' + showIcon()}
          </button>
        </div>
        <form class="groups__create-form create-form" style="height: ${groups.length === 0 ? 'auto' : 0}">
          <label class="create-form__form-label form-label">
            <span class="create-form__form-label-text">Add new group</span>
            <input class="input" type="text" placeholder="Add group title" name="title" ${validation('title')}>
          </label>
          <label class="create-form__form-label form-label">
            <span class="create-form__form-label-text">Add description</span>
            <input class="input" type="text" placeholder="Add description" name="description" ${validation('description')}>
          </label>          
          <button class="button button_primary create-form__add-button" type="submit">
            ${addIcon()}
            Add
          </button>
        </form>
      </div>
      <div class="groups__list list">
        ${
          groups.length === 0
          ? /*html*/`<h5 class="no-entries">No entries yet. Add new one using the form above.</h5>`
          : getTodoGroupsTemplate(groups)}
      </div>
    </div>
  `;
  Maybe.of(page.querySelector('.create-form'))
    .bind(form => form instanceof HTMLFormElement ? form : null)
    .do(form => form.addEventListener("submit", handleAddTodoGroup))
  Maybe.of(page.querySelector('.list')).do(observeList)
  return page;
}

export function getTodoGroupsTemplate(groups) {
  return groups.map(group => {
    return /*html*/`
      <div class="list__item card group" data-id="${group.id}">
        <div class="card__card-header card-header">
          <a class="card__link link" href="#/todos/${group.id}">
            <h3 class="card-title card__card-title group__title">
              ${group.title}
            </h3>
            <div class="card__description description">${group.description}</div>
          </a>
        </div>
        <div class="card__toolbar toolbar">
          <button class="button button_primary" onclick="${dispatchShowEditGroupForm({ groupId: group.id })}">
            ${editIcon()}
            Edit
          </button>
          <button class="button button_danger" onclick="${dispatchRemoveGroup({ groupId: group.id })}">
            ${removeIcon()}
            Remove
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * 
 * @param {Group} group
 */
export function renderTodos(group) {
  const page = fragment/*html*/`
    <div class="todos" data-group-id="${group.id}">
      <div class="header">
        <h1 class="title header__title">${group.title}</h1>
        <div class="header__toolbar toolbar">
          <button class="button button_primary" onclick="window.location.hash = ''">
            ${homeIcon()}
            Home
          </button>
          <div class="dropdown">
            <div class="dropdown__action">
              <button class="button button_primary" id="dropdown__action-button">
                ${showIcon()}
                Actions
              </button>            
            </div>
            <div class="dropdown__content-wrapper">
              <div class="dropdown__content">
                <button class="button button_primary" onclick="${dispatchShowEditGroupForm({ groupId: group.id })}">
                  ${editIcon()}
                  Edit
                </button>
                <button class="button button_secondary" onclick="${dispatchShowGetFakeTodos({ groupId: group.id })}">
                  ${downloadIcon()}
                  Fake todos
                </button>
                <button class="button button_danger" onclick="${dispatchRemoveAllTodos({ groupId: group.id })}">
                  ${removeIcon()}
                  Remove all
                </button>
                <button class="button button_danger" onclick="${dispatchRemoveGroup({ groupId: group.id })}">
                  ${removeIcon()}
                  Remove group
                </button>
              </div>
            </div>
          </div>
          <button class="button button_secondary toolbar__hide-button" id="minimize-button">
            ${document.querySelector(".create-form")?.offsetHeight > 0 || group.todos.length === 0
      ? 'Hide ' + hideIcon() : 'Show ' + showIcon()}
          </button>
        </div>
        <form class="todos__create-form create-form" style="height: ${group.todos.length === 0 ? 'auto' : 0}">
          <label class="create-form__form-label form-label">
            <span class="create-form__form-label-text">Add new todo</span>
            <input class="input" type="text" placeholder="Add todo title" name="title" ${validation('title')}>
          </label>
          <label class="create-form__form-label form-label">
            <span class="create-form__form-label-text">Add description</span>
            <input class="input" type="text" placeholder="Add description" name="description" ${validation('description')}>
          </label>
          <button class="button button_primary create-form__add-button" type="submit">Add</button>
        </form>
      </div>
      <div class="todo-filter">
        <label class="todo-filter__label">
          <span class="todo-filter__label-text">Filter by status</span>
          <select class="input" id="todo-filter" name="done" onchange="window.dispatch?.call(null, 'filter-todos', {groupId: ${group.id}, done: this.value})">
            <option value="all" selected>All</option>
            <option value="true">Done</option>
            <option value="false">In progress</option>
          </select>
        </label>
      </div>
      <div class="todos__list list">
        ${group.todos.length === 0
    ? /*html*/`<h5 class="no-entries">No entries yet. Add new one using the form above.</h5>`
      : getTodosTemplate(group)
    }
      </div>
    </div>
    `
  page.querySelector('.create-form')?.addEventListener("submit", handleAddTodo);
  Maybe.of(page.querySelector('.list')).do(observeList)
  return page;
}

/**
 * 
 * @param {Group} group 
 * @returns 
 */
export function getTodosTemplate(group) {
  const { todos } = group;
  return todos.map(todo => {
    return /*html*/`
      <div class="list__item card todo" data-id="${todo.id}">
        <div class="card__card-header card-header todo-header ${todo.done ? 'todo-header_done' : ''}" 
          onclick="${dispatchToggleTodo({ groupId: group.id, todoId: todo.id })}">
          <h3 class="card-title card__card-title todo__title ${todo.done ? 'todo-title_done' : ''}">
            ${todo.title}
          </h3>
          <h5 class="todo__status status">
            Status:     
            <span class="status__text">
              ${todo.done ? `${doneIcon()} Done` : `${progressIcon()} In progress`}
            </span>        
          </h5>
          <div class="card__description description">${todo.description}</div>
        </div>
        <div class="card__toolbar toolbar">
          <button class="button button_primary" onclick="${dispatchShowEditTodoForm({ groupId: group.id, todoId: todo.id })}">
            ${editIcon()}
            Edit
          </button>
          <button class="button button_danger" onclick="${dispatchRemoveTodo({ groupId: group.id, todoId: todo.id })}">
            ${removeIcon()}
            Remove
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * 
 * @param {Todo} todo 
 * @returns 
 */
export function renderEditTodoForm(todo) {
  const page = fragment/*html*/`
    <h1 class="title container__title">Edit todo</h1>
    <form class="edit-form todo-edit-form" data-group-id=${todo.groupId} data-todo-id=${todo.id}>
      <label class="edit-form__form-label form-label">
        <span class="edit-form__form-label-text">Edit todo title</span>
        <input class="input" type="text" placeholder="Edit todo title" name="title" value="${todo.title}" ${validation('title')}>
      </label>
      <label class="edit-form__form-label form-label">
        <span class="edit-form__form-label-text">Edit description</span>
        <input class="input" type="text" placeholder="Edit description" name="description" value="${todo.description}" ${validation('description')}>
      </label>
      <label class="edit-form__form-label form-label">
        <span class="edit-form__form-label-text">Edit status</span>
        <select class="input" name="done">
          <option value="true" ${todo.done ? 'selected' : ''}>Done</option>
          <option value="false" ${!todo.done ? 'selected' : ''}>In progress</option>
        </select>
      </label>
      <button class="button button_primary" onclick="history.back()">
        ${backIcon()}
        Back
      </button>
      <button class="button button_primary edit-form__edit-button" type="submit">
        ${editIcon()}
        Edit
      </button>
    </form>
  `;
  page.querySelector('.edit-form')?.addEventListener("submit", handleEditTodo);
  return page;
}
/**
 * 
 * @param {Group} group 
 * @returns 
 */
export function renderEditGroupForm(group) {
  const page = fragment/*html*/`
    <h1 class="title container__title">Edit todo</h1>
    <form class="edit-form todo-edit-form" data-group-id=${group.id}>
      <label class="edit-form__form-label form-label">
        <span class="edit-form__form-label-text">Edit todo title</span>
        <input class="input" type="text" placeholder="Edit todo title" name="title" value="${group.title}" ${validation('title')}>
      </label>
      <label class="edit-form__form-label form-label">
        <span class="edit-form__form-label-text">Edit description</span>
        <input class="input" type="text" placeholder="Edit description" name="description" value="${group.description}" ${validation('description')}>
      </label>
      <button class="button button_primary" onclick="history.back()">
        ${backIcon()}
        Back
      </button>
      <button class="button button_primary edit-form__edit-button" type="submit">
        ${editIcon()}
        Edit
      </button>
    </form>
  `;
  page.querySelector('.edit-form')?.addEventListener("submit", handleEditGroup);
  return page;
}

/**
 * 
 * @param {string} content 
 */
export function renderModal(content) {
  return fragment/*html*/`
    <div class="modal">
      <div class="modal__content">
        ${content}
      </div>
    </div>
  `
}

/**
 * 
 * @param {FakeUser[]} users
 * @param {number} groupId
 */
export function renderGetTodosForm(users, groupId) {
  return /*html*/`
    <h2 class="title container__title">Select user for import</h2>
    <form class="edit-form todo-edit-form" data-group-id=${groupId}>
      <label class="edit-form__form-label form-label">
        <span class="edit-form__form-label-text">Select user for import</span>
        <select class="input" name="userId">
          ${users.map(user => {
    return `<option value="${user.id}" ${user.id === 1 ? 'selected' : ''}>${user.name}</option>`
  })}
        </select>
      </label>
      <button class="button button_secondary edit-form__edit-button" type="submit">
        ${downloadIcon()}
        Import
      </button>
    </form>
  `;
}

function validation(name) {
  return `
    required 
    oninvalid="this.setCustomValidity('Please enter a valid ${name}');this.parentElement.classList.add('input_error')"
    oninput="this.setCustomValidity('');this.parentElement.classList.remove('input_error')"
  `;
}