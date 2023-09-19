import type { Todos } from '../../common/apiModels';
export interface AppState {
  todos?: Todos;
  showVsCodeComponents?: boolean;
}

export type ChangeEvent<T extends EventTarget = Element, E extends Event = Event> = E & { currentTarget: EventTarget & T };
export type TextInputEvent<T extends EventTarget = HTMLInputElement, E extends InputEvent = InputEvent> = E & { target: T };
