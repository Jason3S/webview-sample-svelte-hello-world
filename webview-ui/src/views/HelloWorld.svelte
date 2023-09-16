<script lang="ts">
  import { onDestroy } from 'svelte';
  import { getClientApi } from '../api';
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import { vscode, type Disposable } from '../utilities/vscode';
  import VsCodeComponents from './VSCodeComponents.svelte';
  import type { Todos } from '../../../common/apiModels';

  export let showVsCodeComponents = vscode.getState()?.showVsCodeComponents || false;
  export let name: string;
  export let todos: Todos | undefined = undefined;

  const api = getClientApi();
  const disposables: Disposable[] = [];

  let messages: string[] = [];

  $: reversed = [...messages].reverse();

  $: {
    updateState(showVsCodeComponents);
  }

  function handleHowdyClick() {
    api.serverNotification.showInformationMessage('Hey There.');
  }

  async function handleWhatTimeIsIt() {
    const response = await api.serverRequest.whatTimeIsIt();
    messages.push(response);
    messages = messages.slice(-10);
  }

  function updateState(showVsCodeComponents: boolean) {
    const state = vscode.getState();
    if (state?.showVsCodeComponents !== showVsCodeComponents) {
      const newState = state || {};
      newState.showVsCodeComponents = showVsCodeComponents;
      vscode.setState(newState);
    }
  }

  function onChangeTodos(newTodos: Todos) {
    console.log(`${name} onChangeTodos %o`, newTodos);
    todos = newTodos;
  }

  disposables.push(api.onChangeTodos(onChangeTodos));

  onDestroy(() => {
    while (disposables.length) {
      disposables.pop()?.dispose();
    }
  });
</script>

<div>
  <h1>Hello {name}!</h1>
  <VscodeButton on:click={handleHowdyClick}>Howdy!</VscodeButton>
  <VscodeButton on:click={handleWhatTimeIsIt}>What time is it?</VscodeButton>

  <ul>
    {#each reversed as msg}
      <li>{msg}</li>
    {/each}
  </ul>

  {#if todos && todos.todos.length}
    <ul>
      {#each todos.todos as todo}
        <li>{todo.text} - {todo.done}</li>
      {/each}
    </ul>
  {/if}

  <VscodeCheckbox bind:checked={showVsCodeComponents}>Show VSCode Component Samples</VscodeCheckbox>

  {#if showVsCodeComponents}
    <VsCodeComponents></VsCodeComponents>
  {/if}
</div>

<style>
</style>
