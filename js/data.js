// @ts-check

import { Maybe } from './helpers.js';

export function getTodoGroupById(id) {
  const todos = getTodoGroups();
  return todos.find(group => group.id === Number(id));
}

/** @type {TodoGroups | null} */
let todoGroupsStore = null

/**
 * 
 * @returns {Group[]}
 */
export function getTodoGroups() {
  const baseTodoGroups = [
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
  if (todoGroupsStore) return todoGroupsStore;
  const todosFromStorage = localStorage.getItem("todos");
  if (todosFromStorage) {
    try {
      // @ts-ignore
      todoGroupsStore = JSON.parse(todosFromStorage);
      // @ts-ignore
      return todoGroupsStore;
    } catch (e) {
      localStorage.removeItem("todos");
    }
  }
  return baseTodoGroups;
}

/**
 * 
 * @param {GetGroupParams} params
 * @returns 
 */
export function getGroup({ id, todos = null }) {
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
 * @param {TodoGroups?} todoGroups 
 */
export function saveTodos(todoGroups = null) {
  todoGroups ??= getTodoGroups();
  // todoGroups.forEach(group => {
  //   if (group.todos.length === 0) window.dispatch(events.groupHasNoTodos, { groupId: group.id });
  // })
  todoGroupsStore = todoGroups;
  localStorage.setItem("todos", JSON.stringify(todoGroups));
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

/**
 * 
 * @returns {Promise<FakeUser[] | null>}
 */
export async function getFakeUsers() {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    if (!response.ok) throw new Error('Error fetching users');
    /** @type {User[]} */
    const users = await response.json();
    return users.map(user => {
      return {
        id: user.id,
        name: user.name,
      };
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}