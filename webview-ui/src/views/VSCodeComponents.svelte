<script lang="ts">
</script>

<div>
  <h1>Elements</h1>

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

  <vscode-text-field>
    Text Field Label
    <section slot="end" style="display:flex; align-items: center;">
      <vscode-button appearance="icon" aria-label="Match Case">
        <span class="codicon codicon-case-sensitive"></span>
      </vscode-button>
      <vscode-button appearance="icon" aria-label="Match Whole Word">
        <span class="codicon codicon-whole-word"></span>
      </vscode-button>
      <vscode-button appearance="icon" aria-label="Use Regular Expression">
        <span class="codicon codicon-regex"></span>
      </vscode-button>
    </section>
  </vscode-text-field>
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
