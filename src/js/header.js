class DisneyHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    // Create the necessary DOM elements
    const header = document.createElement('header');
    const logoContainer = document.createElement('div');
    const logo = document.createElement('div');

    // Add classes to the created elements
    logoContainer.classList.add('logo-container');
    logo.classList.add('logo');

    // Append the logo to the logo container
    logoContainer.appendChild(logo);

    // Append the logo container to the header
    header.appendChild(logoContainer);

    // Append the header to the custom element
    this.appendChild(header);
  }
}

customElements.define('disney-header', DisneyHeader);
