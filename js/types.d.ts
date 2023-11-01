interface Window {
  modals?: Map<string, DocumentFragment>;
  dispatch: (eventName: string, detail: any) => void
  todos?: Todos;
}

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

type ShowEditGroupFormParams = {
  groupId: number;
};

type RemoveAllTodosParams = {
  groupId: number;
};

type RemoveGroupParams = {
  groupId: number;
};

type ShowGetFakeTodosParams = {
  groupId: number;
};

type GetDataParams = {
  groupId: number;
  todoId?: number | null;
};

type ServerTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

type GetGroupParams = {
  id: number;
  todos?: Todos | null;
}

type GetTodoParams = {
  groupId?: number | null;
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

type FakeUser = {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
