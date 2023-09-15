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
