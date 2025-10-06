import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid"; // import uuid
import "./index.css";

const API_URL = "http://localhost:5000/todos";

class Todo extends Component {
  state = {
    todos: [],
    newTodo: "",
    tempTodos: [],
  };

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    this.setState({ todos: data });
  };

  handleChange = (event) => {
    this.setState({ newTodo: event.target.value });
  };

  addTodoToUI = () => {
    const { newTodo, tempTodos } = this.state;
    if (newTodo.trim() === "") {
      alert("Please enter a task!");
      return;
    }
    // Add to temporary UI list with uuid
    const tempItem = {
      id: uuidv4(), // generate unique id
      text: newTodo,
      completed: false,
      temp: true,
    };
    this.setState({
      tempTodos: [...tempTodos, tempItem],
      newTodo: "",
    });
  };

  saveTodos = async () => {
    const { tempTodos } = this.state;
    for (let tempTodo of tempTodos) {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tempTodo.text, completed: false }),
      });
    }
    this.setState({ tempTodos: [] });
    this.fetchTodos();
  };

  toggleTodo = async (id, completed) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    const updatedTodo = await response.json();
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === id ? updatedTodo : todo
      ),
    }));
  };

  deleteTodo = async (id, isTemp) => {
    if (isTemp) {
      this.setState((prevState) => ({
        tempTodos: prevState.tempTodos.filter((todo) => todo.id !== id),
      }));
    } else {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      this.setState((prevState) => ({
        todos: prevState.todos.filter((todo) => todo.id !== id),
      }));
    }
  };

  render() {
    const { todos, tempTodos, newTodo } = this.state;

    return (
      <div className="todos-bg-container">
        <div className="container">
          <h1 className="todos-heading">Todos</h1>

          <h2 className="create-task-heading">
            Create <span className="create-task-heading-subpart">Task</span>
          </h2>

          <div className="todo-input-section">
            <input
              type="text"
              className="todo-user-input"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={this.handleChange}
            />
            <button className="button" onClick={this.addTodoToUI}>
              Add
            </button>
          </div>

          <h2 className="todo-items-heading">
            My <span className="todo-items-heading-subpart">Tasks</span>
          </h2>

          <ul className="todo-items-container">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <div className="todo-text-container">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => this.toggleTodo(todo.id, todo.completed)}
                  />
                  <span
                    className={
                      todo.completed ? "todo-text completed" : "todo-text"
                    }
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => this.deleteTodo(todo.id, false)}
                >
                  <img
                    className="image"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANgAAACUCAMAAADGZBfIAAAAYFBMVEX///8REREAAABZWVkODg729vb5+fmEhIRtbW3a2trq6uri4uLKyspISEg+Pj7Gxsabm5uSkpKsrKw3NzcuLi52dnYlJSWzs7OkpKQcHBxfX18YGBjQ0NBmZmZSUlLw8PCDFf3XAAADRUlEQVR4nO2dcbdyQBCHMy17FUIpXOX7f8tXrHPIqluZlt7f8+esNM+xR9vasasVK+VmlJL3mzlx0j3dYZ86pjN8jW1QZS9GqRqDrekcX8Hdk/UA2rums3weOyfxSExQbpvO82ni40OvyuwYm87zWexz2xGF7sbRStN5aZes8JUYZYGGrG31C9OZPkl8aFKnIPR2A7wwUM2HpfXF8Fc0/dDTt3tNbxS/4WfzeptI1IlTPnZAXl8yIaJPZjUBrdjoBQkhNi9asXTsgHT2YqVbeAOKRIlJTWN9gFRiie7TrvGhv1Ok8nzxhxyEup1r2poDmvu90B1wOcu0MDr034Zr7cCiM7QY5d7ApPr8OjQ49HeT7PFI9zUEZYmxof9Gcmk1anJjSOyUPfzH9Q6UnQyJhaxe934EeXH4xQzdGb/1ikEMYhBjF2PG1O0+Imt8ovd9LIoWOgcOAPh/cTZbLszeEV2f6zfMN/vozF3feWb5DrQ2LsY0nIIYxCAGMYhBDGIQgxjEIAYxiEHs68XqOYvBY/dmKuM2KrTReYrRUcZxYt00UJZU0dvH8WRVUXnUnGR+YuTXSxTblZhtNNhdo7ugHz3UCwM8f3iW2YkJodaFSdHpjcJSj4RCqxsVsomm4rbnzk+McpVR0b04dFFR99KNBmpFsJsPTjM/sUStyy57Cme1nq0893RV1E4WIKZ618ruNtGPmrF2frrRdbs4XULsQ0AMYhDjBWIQgxgvEIMYxHiBGMQgxgvEIAYxXiAGMYjxAjGIQYwXiEEMYrxADGIQ4wViEIMYLxCDGMR4gRjEIMYLxCAGMV4gBjGI8QKxLxBri3Y2fynaUS/MXUTRTpuR1yuzardYKLo1cBR4D09jCE1h3G9bGNcrgbPUW9KjflT121653EzFqouzsx3HHpQynq7R020pY3yN7pZQynjNNjqd5KDM9Cir6G2ZKWVVNDpoTjJDsa8tF54EiEEMYhCDGMQgBjGILV5sO3gRx1RiudnNQ53Bf/qpxBLD77pP/7Jd5vOI4+jGZR/C5umLlBvfgcwNGMwomMEmtu5+6j2txEw25y2TeipgqreLVyTG+6FiE074dng/NLXtmBb7zibkz1BOtSnvP0q/aKFBAzXWAAAAAElFTkSuQmCC"
                  />
                </button>
              </li>
            ))}

            {tempTodos.map((todo) => (
              <li key={todo.id} className="todo-item temp">
                <div className="todo-text-container">
                  <input type="checkbox" checked={todo.completed} readOnly />
                  <span className="todo-text">{todo.text}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => this.deleteTodo(todo.id, true)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <button className="button" onClick={this.saveTodos}>
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default Todo;
