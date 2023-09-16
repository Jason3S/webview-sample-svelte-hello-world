<script lang="ts">
  import { onDestroy } from 'svelte';
  import { getClientApi } from '../api';
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import VscodeTextField from '../components/VscodeTextField.svelte';
  import { type Disposable } from '../utilities/vscode';
  import type { Todos } from '../../../common/apiModels';

  const api = getClientApi();
  const disposables: Disposable[] = [];
  disposables.push(api.onChangeTodos(onChangeTodos));

  onDestroy(() => {
    while (disposables.length) {
      disposables.pop()?.dispose();
    }
  });

  let todos: Todos | undefined = undefined;
  let lastSig = '';
  let lastSeq = -1;

  async function add() {
    if (!todos) return;
    todos.todos.push({
      done: false,
      text: '',
    });
    todos = todos;
  }

  function clear() {
    if (!todos) return;
    todos.todos = todos.todos.filter((t) => !t.done);
    todos = todos;
  }

  function reset() {
    return api.serverRequest.resetTodos();
  }

  $: remaining = (todos?.todos || []).filter((t) => !t.done).length;
  $: {
    onTodoUpdate(todos);
  }

  async function onTodoUpdate(todos: Todos | undefined) {
    if (!todos) return;
    const sig = calcTodoSig(todos);
    if (sig === lastSig) return;
    const result = await api.serverRequest.updateTodos(todos);
    onChangeTodos(result.value);
  }

  async function initTodos() {
    const t = await api.serverRequest.getTodos();
    todos = t ?? todos;
  }

  function onChangeTodos(newTodos: Todos) {
    if (newTodos.seq <= lastSeq) return;
    if (newTodos.seq <= (todos?.seq || 0)) return;
    const sig = calcTodoSig(newTodos);
    if (sig === lastSig) return;
    lastSig = sig;
    lastSeq = newTodos.seq;
    todos = newTodos;
  }

  function calcTodoSig(todos: Todos): string {
    return JSON.stringify(todos);
  }

  initTodos();
</script>

<div>
  <h1>todos</h1>

  <ul class="todos">
    {#if todos}
      {#each todos.todos as todo}
        <li class="todo-item" class:done={todo.done}>
          <VscodeTextField inputType="text" placeholder="What needs to be done?" bind:value={todo.text}
            ><section class="slot" slot="start"><VscodeCheckbox bind:checked={todo.done} /></section></VscodeTextField
          >
        </li>
      {/each}
    {:else}
      <b>Get Started! Add a new Todo.</b>
    {/if}
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
