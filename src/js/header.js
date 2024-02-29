class DisneyHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header><div class="logo-container"><div class="logo"></div></div></header>
    `;
  }
}

customElements.define('disney-header', DisneyHeader);
