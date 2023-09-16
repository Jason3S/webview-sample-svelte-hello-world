import { TodoList, Todos } from '../common/apiModels';
import { ObservableValue, createStoreValue } from './ObservableValue';

export interface Storage {
  todos: ObservableValue<Todos>;
}

export const store: Storage = {
  todos: createStoreValue({ seq: 1, todos: [] }),
};

export const sampleList: TodoList = [
  { done: false, text: 'finish Svelte tutorial' },
  { done: false, text: 'build an app' },
  { done: false, text: 'world domination' },
];
