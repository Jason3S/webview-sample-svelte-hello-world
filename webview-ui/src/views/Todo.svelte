<script lang="ts">
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import VscodeTextField from '../components/VscodeTextField.svelte';
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
      <li class="todo-item" class:done={todo.done}>
        <VscodeTextField inputType="text" placeholder="What needs to be done?" bind:value={todo.text}
          ><section class="slot" slot="start"><VscodeCheckbox bind:checked={todo.done} /></section></VscodeTextField
        >
      </li>
    {/each}
  </ul>

  <p>{remaining} remaining</p>

  <div class="todo-actions">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <VscodeButton on:click={add}>Add New</VscodeButton>

    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <VscodeButton on:click={clear}>Clear Completed</VscodeButton>

    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <VscodeButton on:click={reset}>Reset the List</VscodeButton>
  </div>
</div>

<style>
  .done {
    opacity: 0.4;
  }

  li {
    display: flex;
  }

  .todos {
    padding-inline-start: 0;
    width: 100%;
  }

  .todo-actions {
    width: 100%;
  }

  .todo-actions > :global(vscode-button) {
    display: block;
    width: 100%;
    max-width: 300px;
    margin: 5px auto;
    text-align: center;
  }

  .todo-item {
    width: 100%;
  }

  /* input[type='text'] {
    flex: 1;
    padding: 0.5em;
    margin: -0.2em 0;
    border: none;
  } */
</style>
