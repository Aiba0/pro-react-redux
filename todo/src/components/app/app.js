import React, { Component } from 'react';

import AppHeader from '..//app-header';
import ItemStatusFilter from '..//item-status-filter';
import SearchPanel from '..//search-panel';
import TodoList from '..//todo-list';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
  maxId = 100;

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Go Rest'),
    ],
    term: '',
    filter: 'all',
  };

  createTodoItem(label) {
    return { label, important: false, done: false, id: (this.maxId += 1) };
  }

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);

      return {
        todoData: [...todoData.slice(0, idx), ...todoData.slice(idx + 1)],
      };
    });
  };

  addItem = (text) => {
    this.setState(({ todoData }) => {
      return {
        todoData: [...todoData, this.createTodoItem(text)],
      };
    });
  };

  toggleProperty(arr, id, propName) {
    return arr.map((el) =>
      el.id === id ? { ...el, [propName]: !el[propName] } : el,
    );
  }

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important'),
      };
    });
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done'),
      };
    });
  };

  onSearchChange = (term) => {
    this.setState({ term });
  };

  search(items, term) {
    return term.length === 0
      ? items
      : items.filter((item) =>
          item.label.toLowerCase().includes(term.toLowerCase()),
        );
  }

  onFilterChange = (filter) => {
    this.setState({ filter });
  };

  filter(items, filter) {
    return filter === 'active'
      ? items.filter((item) => !item.done)
      : filter === 'done'
      ? items.filter((item) => item.done)
      : items;
  }

  render() {
    const { todoData, term, filter } = this.state;

    const visibleItems = this.filter(this.search(todoData, term), filter);

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange} />
          <ItemStatusFilter
            filter={filter}
            onFilterChange={this.onFilterChange}
          />
        </div>

        <TodoList
          todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />

        <ItemAddForm onItemAdded={this.addItem} />
      </div>
    );
  }
}
