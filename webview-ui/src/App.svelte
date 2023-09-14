<script lang="ts">
  import { provideVSCodeDesignSystem, allComponents } from '@vscode/webview-ui-toolkit';
  import { getClientApi } from './api';
  import Todo from './components/Todo.svelte';

  // In order to use the Webview UI Toolkit web components they
  // must be registered with the browser (i.e. webview) using the
  // syntax below.
  provideVSCodeDesignSystem().register(allComponents);

  // To register more toolkit components, simply import the component
  // registration function and call it from within the register
  // function, like so:
  //
  // provideVSCodeDesignSystem().register(
  //   vsCodeButton(),
  //   vsCodeCheckbox()
  // );
  //
  // Finally, if you would like to register all of the toolkit
  // components at once, there's a handy convenience function:
  //
  // provideVSCodeDesignSystem().register(allComponents);

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
    messages = messages;
  }
</script>

<main>
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

  <Todo />

  <h2>Elements</h2>

  <div>
    <ul>
      <li>Link: <vscode-link href="#">Link Text</vscode-link></li>
      <li>Checkbox: <vscode-checkbox>Label</vscode-checkbox></li>
      <li>Divider: <vscode-divider></vscode-divider></li>
      <li>
        <div class="dropdown-container">
          <label for="my-dropdown">Choose an option:</label>
          <vscode-dropdown id="my-dropdown">
            <vscode-option>Option Label #1</vscode-option>
            <vscode-option>Option Label #2</vscode-option>
            <vscode-option>Option Label #3</vscode-option>
          </vscode-dropdown>
        </div>
      </li>
    </ul>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
  }

  .dropdown-container {
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .dropdown-container label {
    display: block;
    color: var(--vscode-foreground);
    cursor: pointer;
    font-size: var(--vscode-font-size);
    line-height: normal;
    margin-bottom: 2px;
  }
</style>
