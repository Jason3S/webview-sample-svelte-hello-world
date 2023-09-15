<script lang="ts">
  import type { TextField } from '@vscode/webview-ui-toolkit';
  import type { ChangeEvent } from '../types';

  /** Determines if the element should receive document focus on page load. */
  export let autofocus: boolean | undefined = undefined;
  /** Prevents the user from interacting with the button––it cannot be pressed or focused. */
  export let disabled: true | undefined = undefined;
  /** When true, the control will be immutable by user interaction. */
  export let makeReadonly: boolean | undefined = undefined;
  /** The string to use as the value of the checkbox when submitting the form */
  export let value: string | undefined = undefined;
  /** The maximum number of characters a user can enter. */
  export let maxlength: number | undefined = undefined;
  /** The name of the component. */
  export let name: string | undefined = undefined;
  /** Sets the placeholder value of the component, generally used to provide a hint to the user. */
  export let placeholder: string | undefined = undefined;
  /** Sets the width of the element to a specified number of characters. */
  export let size: number | undefined = undefined;
  /** Sets the text field type. */
  export let inputType: string | undefined = undefined;

  $: extraProps = { autofocus, disabled, readonly: makeReadonly, maxlength, name, placeholder, size, type: inputType };
  $: props = Object.fromEntries(Object.entries(extraProps).filter(([_k, v]) => typeof v !== 'undefined'));

  function handleChanged(e: ChangeEvent<TextField>) {
    value = e.currentTarget.value;
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<vscode-text-field {...props} {value} on:change={handleChanged}>
  {#if $$slots.start}
    <section slot="start"><slot name="start" /></section>
  {/if}
  <slot />
  {#if $$slots.end}
    <section slot="end"><slot name="end" /></section>
  {/if}
</vscode-text-field>

<style>
</style>
