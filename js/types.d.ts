type BaseTodoParams = {
  groupId: number;
  todoId: number;
};

type ToggleTodoParams = BaseTodoParams

type RemoveTodoParams = BaseTodoParams

type EditTodoParams = BaseTodoParams & {
  title: string;
  description: string;
};

type ShowEditTodoFormParams = BaseTodoParams;

type RemoveAllTodosParams = {
  groupId: number;
};

type GetFakeTodosParams = {
  groupId: number;
  userId: number;
};

type GetDataParams = {
  groupId: number;
  todoId?: number | null;
};

type ServerTodo = {
  userId:    number;
  id:        number;
  title:     string;
  completed: boolean;
}

type GetGroupParams = {
  id: number;
  todos?: Todos | null;
}

type GetTodoParams = {
  groupId: number;
  todoId: number;
  group?: Group | null;
};

type Todo = {
  id: number;
  groupId: number;
  title: string;
  description: string;
  done: boolean;
};

type Group = {
  id: number;
  title: string;
  description: string;
  todos: Todo[];
}

type Todos = Group[];