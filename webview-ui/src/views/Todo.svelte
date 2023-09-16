<script lang="ts">
  import { getClientApi } from '../api';
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import VscodeTextField from '../components/VscodeTextField.svelte';
  import { todos } from '../state/appState';

  const api = getClientApi();

  $: remaining = $todos?.todos.filter((t) => !t.done).length || 0;

  async function add() {
    todos.update((t) => {
      if (!t) return t;

      const list = [
        ...t.todos,
        {
          done: false,
          text: '',
        },
      ];
      return { ...t, todos: list };
    });
  }

  function clear() {
    todos.update((t) => {
      if (!t) return t;
      return { ...t, todos: t.todos.filter((t) => !t.done) };
    });
  }

  function reset() {
    return api.serverRequest.resetTodos();
  }
</script>

<div>
  <h1>todos</h1>

  <ul class="todos">
    {#if $todos}
      {#each $todos.todos as todo}
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
