export const filterTodos = (todos, selected) => {
  switch (selected) {
    case "Home":
      return todos.filter(
        (todo) => todo.cat === "Home" && todo.endOfDay > todo.date
      );
    case "Work":
      return todos.filter(
        (todo) => todo.cat === "Work" && todo.endOfDay > todo.date
      );
    case "Personal":
      return todos.filter(
        (todo) => todo.cat === "Personal" && todo.endOfDay > todo.date
      );
    case "Health":
      return todos.filter(
        (todo) => todo.cat === "Health" && todo.endOfDay > todo.date
      );
    case "Study":
      return todos.filter(
        (todo) => todo.cat === "Study" && todo.endOfDay > todo.date
      );
    case "Devotional":
      return todos.filter(
        (todo) => todo.cat === "Devotional" && todo.endOfDay > todo.date
      );
    case "Other":
      return todos.filter(
        (todo) => todo.cat === "Other" && todo.endOfDay > todo.date
      );
    case "Completed":
      return todos.filter((todo) => todo.ischecked);
    case "Pending":
      return todos.filter(
        (todo) => todo.endOfDay > new Date().toISOString() && todo.pending
      );
    case "Uncompleted":
      return todos.filter((todo) => !todo.pending && !todo.ischecked);
    case "All":
      return todos.filter((todo) => {
        return todo.endOfDay > new Date().toISOString();
      });
    default:
      return todos;
  }
};
