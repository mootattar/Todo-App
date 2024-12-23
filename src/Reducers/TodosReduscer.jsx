export const initialState = {
  todos: [],
  loading: false,
  error: null,
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TODOS_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "FETCH_TODOS_SUCCESS":
      return {
        ...state,
        loading: false,
        todos: action.payload,
      };
    case "FETCH_TODOS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CREATE_TODOS_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "CREATE_TODOS_SUCCESS":
      return {
        ...state,
        loading: false,
        todos: [...state.todos, action.payload],
      };
    case "CREATE_TODOS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "completed": {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            ischecked: !todo.ischecked,
          };
        }
        return todo;
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case "updateTodo": {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            Title: action.payload.Title,
            body: action.payload.body,
            cat: action.payload.cat,
          };
        }
        return todo;
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case "UpdateTodosFailure": {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    case "deleteTodo": {
      const newTodos = state.todos.filter((todo) => {
        if (todo.id === action.payload.id) {
          return false;
        }
        return true;
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case "Delete_TODOS_FAILURE": {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};

export default todosReducer;
