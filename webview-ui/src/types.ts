export interface AppState {
  todos?: Todo[];
  showVsCodeComponents?: boolean;
}

export interface Todo {
  done: boolean;
  text: string;
}

export type ChangeEvent<T extends EventTarget = Element, E extends Event = Event> = E & { currentTarget: EventTarget & T };
