class CustomDialog extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <dialog id="myDialog">
        <slot name="title"></slot>
        <slot name="release"></slot>
        <slot name="img"></slot>
        <button id="close-btn">Close</button>
      </dialog>
    `;
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace') {
        this.hide();
      }
    });

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
    const titleHTML = `<h2>${title}</h2>`;
    const releaseHTML = `<p>Release Year: ${releaseYear}</p>`;
    const imgHTML = `<img src=${imgUrl} alt=${title} />`;
    const dialog = this.querySelector('#myDialog');
    this.querySelector('slot[name="title"]').innerHTML = titleHTML;
    this.querySelector('slot[name="release"]').innerHTML = releaseHTML;
    this.querySelector('slot[name="img"]').innerHTML = imgHTML;
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
