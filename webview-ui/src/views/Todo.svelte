<script lang="ts">
  import type { Checkbox, TextField } from '@vscode/webview-ui-toolkit';
  import type { ChangeEventHandler } from 'svelte/elements';
  import { vscode } from '../utilities/vscode';

  interface Todo {
    done: boolean;
    text: string;
  }

  const sampleList: Todo[] = [
    { done: false, text: 'finish Svelte tutorial' },
    { done: false, text: 'build an app' },
    { done: false, text: 'world domination' },
  ];

  let todos: Todo[] = vscode.getState()?.todos || [...sampleList];

  function add() {
    todos = todos.concat({
      done: false,
      text: '',
    });
  }

  function clear() {
    todos = todos.filter((t) => !t.done);
  }

  function reset() {
    todos = [...sampleList];
    onTodoUpdate();
  }

  $: remaining = todos.filter((t) => !t.done).length;

  function onChecked(update: (v: boolean) => unknown): ChangeEventHandler<Checkbox> {
    return (e) => update(e.currentTarget.checked);
  }

  function onChangeText(update: (v: string) => unknown): ChangeEventHandler<TextField> {
    return (e) => update(e.currentTarget.value || '');
  }

  function onTodoUpdate(_todo?: Todo) {
    console.log('onTodoUpdate %o', _todo);
    const state = vscode.getState() || {};
    state.todos = todos;
    vscode.setState(state);
  }
</script>

<div>
  <h1>todos</h1>

  <ul class="todos">
    {#each todos as todo}
      <li class:done={todo.done}>
        <vscode-text-field
          type="text"
          placeholder="What needs to be done?"
          value={todo.text}
          on:change={onChangeText((text) => ((todo.text = text), onTodoUpdate(todo)))}
          ><vscode-checkbox
            slot="start"
            checked={todo.done}
            on:change={onChecked((checked) => ((todo.done = checked), onTodoUpdate(todo)))}
          /></vscode-text-field
        >
      </li>
    {/each}
  </ul>

  <p>{remaining} remaining</p>

  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <vscode-button on:click={add}> Add new </vscode-button>

  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <vscode-button on:click={clear}> Clear completed </vscode-button>

  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <vscode-button on:click={reset}> Reset the list </vscode-button>
</div>

<style>
  .done {
    opacity: 0.4;
  }

  li {
    display: flex;
  }

  /* input[type='text'] {
    flex: 1;
    padding: 0.5em;
    margin: -0.2em 0;
    border: none;
  } */
</style>
