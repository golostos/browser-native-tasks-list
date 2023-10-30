// @ts-check

import { Maybe } from './helpers.js';

export function getTodoGroupById(id) {
  const todos = getTodoGroups();
  return todos.find(group => group.id === Number(id));
}

/**
 * 
 * @returns {Group[]}
 */
export function getTodoGroups() {
  const baseTodos = [
    {
      id: 1,
      title: "Todolist 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, alias.",
      todos: [
        {
          id: 1,
          title: "Todo 1 content 1",
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, alias.",
          done: false,
          groupId: 1
        },
        {
          id: 2,
          title: "Todo 1 content 2",
          description: "",
          done: true,
          groupId: 1
        },
      ]
    }
  ];
  if ('todos' in window && Array.isArray(window.todos)) return window.todos;
  const todosFromStorage = localStorage.getItem("todos");
  if (todosFromStorage) {
    try {
      // @ts-ignore
      window.todos = JSON.parse(todosFromStorage);
      // @ts-ignore
      return window.todos;
    } catch (e) {
      localStorage.removeItem("todos");
    }
  }
  return baseTodos;
}

/**
 * 
 * @param {GetGroupParams} params
 * @returns 
 */
export function getGroup({id, todos = null}) {  
  return Maybe.of(todos ?? getTodoGroups())
    .bind(todos => todos.find(group => group.id === Number(id)))
    .get();
}

/**
 * 
 * @param {GetTodoParams} params
 * @returns 
 */
export function getTodo({ groupId = null, todoId, group = null }) {
  if (groupId) return Maybe.of(group ?? getGroup({ id: groupId }))
    .bind(group => group.todos.find(todo => todo.id === Number(todoId)))
    .get();
  return Maybe.of(getTodoGroups())
    .bind(groups => {
      for (const group of groups) {
        for (const todo of group.todos) {
          if (todo.id === todoId) return todo
        }
      }
    })
    .get()
}

/**
 * 
 * @param {GetDataParams} params
 * @returns 
 */
export function getData({ groupId, todoId = null }) {
  const todos = getTodoGroups();
  const group = getGroup({ id: groupId, todos });
  if (todoId === null) return { todos, group };
  const todo = getTodo({
    groupId,
    todoId,
    group,
  });
  return { todos, group, todo };
}

/**
 * 
 * @param {Todos?} todos 
 */
export function saveTodos(todos = null) {
  localStorage.setItem("todos", JSON.stringify(todos ?? getTodoGroups()));
}

/**
 * @param {number} id 
 */
export async function getFakeTodosForUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}/todos`);
    /** @type {ServerTodo[]} */
    const todos = await response.json();
    return todos.map(todo => {
      return {
        id: todo.id,
        title: todo.title,
        description: todo.completed ? 'Done' : 'In progress',
        done: todo.completed,
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}