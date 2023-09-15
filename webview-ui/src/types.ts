export interface AppState {
  todos?: Todo[];
}

export interface Todo {
  done: boolean;
  text: string;
}
