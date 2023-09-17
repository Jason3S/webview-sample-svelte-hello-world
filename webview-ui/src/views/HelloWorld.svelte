<script lang="ts">
  import { writable } from 'svelte/store';
  import { LogLevel, getLogLevel, setLogLevel } from '../../../common/logger';
  import { getClientApi } from '../api';
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import { todos } from '../state/appState';
  import { vscode } from '../utilities/vscode';
  import VsCodeComponents from './VSCodeComponents.svelte';

  export let showVsCodeComponents = vscode.getState()?.showVsCodeComponents || false;
  export let name: string;

  const api = getClientApi();

  let logDebug = writable<boolean | undefined>(getLogLevel() >= LogLevel.debug);

  let messages: string[] = [];

  $: reversed = [...messages].reverse();

  $: {
    updateState(showVsCodeComponents);
  }

  logDebug.subscribe((value) => {
    const level = value ? LogLevel.debug : LogLevel.error;
    api.serverRequest.setLogLevel(level);
    setLogLevel(level);
  });

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

  {#if $todos && $todos.todos.length}
    <ul>
      {#each $todos.todos as todo}
        <li>{todo.text} - {todo.done}</li>
      {/each}
    </ul>
  {/if}

  <VscodeCheckbox bind:checked={showVsCodeComponents}>Show VSCode Component Samples</VscodeCheckbox>
  <VscodeCheckbox bind:checked={$logDebug}>Log Debug Info</VscodeCheckbox>

  {#if showVsCodeComponents}
    <VsCodeComponents></VsCodeComponents>
  {/if}
</div>

<style>
</style>
