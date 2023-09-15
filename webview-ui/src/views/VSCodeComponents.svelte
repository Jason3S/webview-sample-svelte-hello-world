<script lang="ts">
  import VscodeButton from '../components/VscodeButton.svelte';
  import VscodeCheckbox from '../components/VscodeCheckbox.svelte';
  import VscodeTextField from '../components/VscodeTextField.svelte';
</script>

<div>
  <h1>Elements</h1>

  <section>
    <h3>Samples</h3>

    <ul>
      <li>Link: <vscode-link href="#">Link Text</vscode-link></li>
      <li>Checkbox: <VscodeCheckbox>Label</VscodeCheckbox></li>
      <li>Divider: <vscode-divider /></li>
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
  </section>

  <section>
    <h3>Buttons</h3>

    <VscodeButton appearance="primary">Primary</VscodeButton>
    <VscodeButton appearance="secondary">Secondary</VscodeButton>
    Icon: <VscodeButton appearance="icon" ariaLabel="Use Regular Expression">
      <span class="codicon codicon-regex"></span>
    </VscodeButton>
  </section>

  <section>
    <h3>Inputs</h3>

    <VscodeTextField>
      Text Field Label
      <section slot="end" style="display:flex; align-items: center;">
        <VscodeButton appearance="icon" ariaLabel="Match Case">
          <span class="codicon codicon-case-sensitive"></span>
        </VscodeButton>
        <VscodeButton appearance="icon" ariaLabel="Match Whole Word">
          <span class="codicon codicon-whole-word"></span>
        </VscodeButton>
        <VscodeButton appearance="icon" ariaLabel="Use Regular Expression">
          <span class="codicon codicon-regex"></span>
        </VscodeButton>
      </section>
    </VscodeTextField>
  </section>
</div>

<style>
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
