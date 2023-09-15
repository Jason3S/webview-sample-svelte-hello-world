<script lang="ts">
  import { getClientApi } from '../api';
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import { vscode } from '../utilities/vscode';
  import VsCodeComponents from './VSCodeComponents.svelte';

  export let showVsCodeComponents = vscode.getState()?.showVsCodeComponents || false;
  export let name: string;

  let messages: string[] = [];

  $: reversed = [...messages].reverse();

  $: {
    updateState(showVsCodeComponents);
  }

  function handleHowdyClick() {
    const api = getClientApi();
    api.serverNotification.showInformationMessage('Hey There.');
  }

  async function handleWhatTimeIsIt() {
    const api = getClientApi();
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

  <VscodeCheckbox bind:checked={showVsCodeComponents}>Show VSCode Component Samples</VscodeCheckbox>

  {#if showVsCodeComponents}
    <VsCodeComponents></VsCodeComponents>
  {/if}
</div>

<style>
</style>
