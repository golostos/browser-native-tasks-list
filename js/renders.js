// @ts-check

import { getTodos } from './data.js';
import { onGetFakeTodos, onRemoveAllTodos, onRemoveTodo, onShowEditTodoForm, onToggleTodo } from './events.js';
import { addIcon, backIcon, doneIcon, downloadIcon, editIcon, showIcon, progressIcon, removeIcon, hideIcon, homeIcon } from "./icons.js";

export function renderNotFound() {
  return /*html*/`
    <h1 class="title container__title">PAGE NOT FOUND</h1>
  `;
}

export function renderGroups() {
  const groups = getTodos();
  return /*html*/`
    <div class="groups">
      <div class="header">
        <h1 class="title header__title">Todos list</h1>
        <div class="header__toolbar toolbar">
          <button class="button button_danger" data-action="remove-all-groups">
            ${removeIcon()}
            Remove all
          </button>
          <button class="button button_secondary toolbar__hide-button" id="minimize-button">
            ${document.querySelector(".create-form")?.offsetHeight > 0
              ? 'Hide ' + hideIcon() : 'Show ' + showIcon()}
          </button>
        </div>
        <form class="groups__create-form create-form">
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
        ${getTodoGroupsTemplate(groups)}
      </div>
    </div>
  `;
}

export function getTodoGroupsTemplate(groups) {
  return groups.map(group => {
    return /*html*/`
      <div class="card group" data-id="${group.id}">
        <div class="card__card-header card-header">          
          <a class="card__link link" href="#/todos/${group.id}">
            <h3 class="card-title card__card-title group__title">
              ${group.title}
            </h3>
            <div class="card__description description">${group.description}</div>
          </a>
        </div>
        <div class="card__toolbar toolbar">
          <button class="button button_primary">
            ${editIcon()}
            Edit
          </button>
          <button class="button button_danger">
            ${removeIcon()}
            Remove
          </button>
        </div>
      </div>
    `;
  }).join("");
}

export function renderTodos(group) {
  return /*html*/`
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
                <button class="button button_primary" data-action="edit-group">
                  ${editIcon()}
                  Edit
                </button>
                <button class="button button_secondary" onclick="${onGetFakeTodos({ groupId: group.id, userId: 1 })}">
                  ${downloadIcon()}
                  Fake todos
                </button>
                <button class="button button_danger" onclick="${onRemoveAllTodos({ groupId: group.id })}">
                  ${removeIcon()}
                  Remove all
                </button>
                <button class="button button_danger" data-action="remove-group">
                  ${removeIcon()}
                  Remove group
                </button>
              </div>
            </div>
          </div>
          <button class="button button_secondary toolbar__hide-button" id="minimize-button">
            ${document.querySelector(".create-form")?.offsetHeight > 0
      ? 'Hide ' + hideIcon() : 'Show ' + showIcon()}
          </button>
        </div>
        <form class="todos__create-form create-form">
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
      <div class="todos__list list">
        ${getTodosTemplate(group)}
      </div>
    </div>
    `
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
      <div class="card todo" data-id="${todo.id}">
        <div class="card__card-header card-header todo-header ${todo.done ? 'todo-header_done' : ''}" 
          onclick="${onToggleTodo({ groupId: group.id, todoId: todo.id })}">
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
          <button class="button button_primary" onclick="${onShowEditTodoForm({ groupId: group.id, todoId: todo.id })}">
            ${editIcon()}
            Edit
          </button>
          <button class="button button_danger" onclick="${onRemoveTodo({ groupId: group.id, todoId: todo.id })}">
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
  return /*html*/`
    <div class="overlay">
      <h1 class="overlay__header">Edit todo</h1>
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
    </div>
  `;
}

function validation(name) {
  return `
    required 
    oninvalid="this.setCustomValidity('Please enter a valid ${name}');this.parentElement.classList.add('input_error')"
    oninput="this.setCustomValidity('');this.parentElement.classList.remove('input_error')"
  `;
}