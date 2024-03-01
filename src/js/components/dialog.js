class CustomDialog extends HTMLElement {
  constructor() {
    super();

    // Create dialog element
    const dialog = document.createElement('dialog');
    dialog.id = 'myDialog';

    // Create slots
    const titleSlot = document.createElement('slot');
    titleSlot.name = 'title';
    const releaseSlot = document.createElement('slot');
    releaseSlot.name = 'release';
    const imgSlot = document.createElement('slot');
    imgSlot.name = 'img';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.id = 'close-btn';
    closeButton.textContent = 'Close';

    // Append slots and close button to the dialog
    dialog.appendChild(titleSlot);
    dialog.appendChild(releaseSlot);
    dialog.appendChild(imgSlot);
    dialog.appendChild(closeButton);

    // Append the dialog to the custom element
    this.appendChild(dialog);

    // Add event listener for Backspace keyboard input
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace') {
        this.hide();
      }
    });

    // Add event listener for pressing the close button
    this.querySelector('#close-btn').addEventListener('click', () => {
      this.hide();
    });
  }

  /**
   * Inserts content into the slots and shows the dialog
   * @param {Object} content
   */
  open(content) {
    const { title, imgUrl, releaseYear } = content;

    // Create elements for dialog content
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    const releaseElement = document.createElement('p');
    releaseElement.textContent = `Release Year: ${releaseYear}`;
    const imgElement = document.createElement('img');
    imgElement.src = imgUrl;
    imgElement.alt = title;

    // Append content to slots
    const titleSlot = this.querySelector('slot[name="title"]');
    const releaseSlot = this.querySelector('slot[name="release"]');
    const imgSlot = this.querySelector('slot[name="img"]');
    titleSlot.replaceChildren(titleElement);
    releaseSlot.replaceChildren(releaseElement);
    imgSlot.replaceChildren(imgElement);

    // Show the dialog
    const dialog = this.querySelector('#myDialog');
    dialog.showModal();
  }

  /**
   * closes the dialog
   */
  hide() {
    const dialog = this.querySelector('#myDialog');
    dialog.close();
  }
}

customElements.define('custom-dialog', CustomDialog);
