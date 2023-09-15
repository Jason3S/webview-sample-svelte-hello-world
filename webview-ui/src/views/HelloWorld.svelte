<script lang="ts">
  import { getClientApi } from '../api';
  import VsCodeComponents from './VSCodeComponents.svelte';

  export let name: string;

  let messages: string[] = [];

  $: reversed = [...messages].reverse();

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
</script>

<div>
  <h1>Hello {name}!</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events  a11y-no-static-element-interactions -->
  <vscode-button on:click={handleHowdyClick}>Howdy!</vscode-button>
  <!-- svelte-ignore a11y-click-events-have-key-events  a11y-no-static-element-interactions -->
  <vscode-button on:click={handleWhatTimeIsIt}>What time is it?</vscode-button>

  <ul>
    {#each reversed as msg}
      <li>{msg}</li>
    {/each}
  </ul>

  <VsCodeComponents></VsCodeComponents>
</div>

<style>
</style>
