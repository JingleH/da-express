/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { setToken } from './utils.js';
import { html, render } from './htm-preact.js';
import App from './app.js';

const { token } = await DA_SDK;
setToken(token);

async function init() {
  render(html`<${App} />`, document.getElementById('app-root'));
}

init().catch(console.error);
