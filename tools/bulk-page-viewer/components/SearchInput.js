import { html, css, LitElement } from '../lit.min.js';

class SearchInput extends LitElement {
  static styles = css`p { color: blue }`;

  constructor() {
    super();
    this.value = '';
  }

  render() {
    return html`searching ${this.value}`;
  }
}

customElements.define('search-input', SearchInput);
