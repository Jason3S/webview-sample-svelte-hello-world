import { LogLevel } from 'vscode';
import { TodoList, Todos } from '../common/apiModels';
import { ObservableValue, createStoreValue } from './ObservableValue';

export interface Storage {
  todos: ObservableValue<Todos>;
}

export const store: Storage = {
  todos: createStoreValue({ seq: 1, todos: [] }),
};

export const sampleList: TodoList = [
  { uuid: 1, done: false, text: 'finish Svelte tutorial' },
  { uuid: 2, done: false, text: 'build an app' },
  { uuid: 3, done: false, text: 'world domination' },
];
