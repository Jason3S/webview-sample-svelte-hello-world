<script lang="ts">
  import { getClientApi } from '../api';
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import VscodeTextField from '../components/VscodeTextField.svelte';
  import { todos } from '../state/appState';

  const api = getClientApi();

  $: remaining = $todos?.todos.filter((t) => !t.done).length || 0;

  let key: string | undefined;

  let submitInfo = '';
  let focusId = 0;

  let focused = '';
  let blurred = '';

  async function add() {
    if (!$todos) return;
    const todo = {
      uuid: Math.random() * 100000 + Date.now(),
      done: false,
      text: '',
    };
    focusId = todo.uuid;
    $todos.todos.push(todo);
    $todos = $todos;
  }

  function clear() {
    if (!$todos) return;
    $todos.todos = $todos.todos.filter((t) => !t.done);
    $todos = $todos;
  }

  function reset() {
    return api.serverRequest.resetTodos();
  }

  function changed(index: number) {
    if (index + 1 === $todos?.todos.length) {
      add();
    } else {
      // Move to the next todo
      const td = $todos?.todos[index + 1];
      if (!td) return;
      focusId = td.uuid;
    }
  }
</script>

<div>
  <h1>todos</h1>

  <form on:submit|preventDefault={add}>
    <ul class="todos">
      {#if $todos}
        {#each $todos.todos as todo, index (todo.uuid)}
          <li class="todo-item" class:done={todo.done}>
            <VscodeTextField
              inputType="text"
              placeholder="What needs to be done?"
              bind:value={todo.text}
              on:change={() => changed(index)}
              on:blur={() => (blurred = `${todo.uuid} ${todo.text}`)}
              on:focus={() => (focused = `${todo.uuid} ${todo.text}`)}
              focus={todo.uuid === focusId}
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

    <ul>
      <li>Key: {key}</li>
      <li>Focused: {focused}</li>
      <li>Blurred: {blurred}</li>
    </ul>
  </form>

  <pre>
    {submitInfo}
  </pre>
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
