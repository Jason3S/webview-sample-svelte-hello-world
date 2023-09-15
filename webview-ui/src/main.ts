import App from './App.svelte';

function getView() {
  const node = document.querySelector('meta[property="view-name"]');
  if (node) {
    return node.getAttribute('content');
  } else {
    return null;
  }
}

const app = new App({
  target: document.body,
  props: {
    name: 'web world',
    view: getView(),
  },
});

export default app;
