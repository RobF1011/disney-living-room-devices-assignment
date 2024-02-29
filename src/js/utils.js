/**
 * Attaches the keydown event listeners for all collection items
 * @param {NodeListOf<Element>} items
 */
export default function attachEventListeners (items) {
  for (let i = 0; i < items.length; i++) {
    // all collection-items
    const item = items[i];
    item.addEventListener('keydown', (event) => {
      event.preventDefault(); // Prevent default scrolling behavior
      const currentIndex = Array.from(items).indexOf(item);
      let nextIndex;

      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % items.length;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + items.length) % items.length;
          break;
        case 'ArrowDown':
          nextIndex = (currentIndex + 5);
          break;
        case 'ArrowUp':
          nextIndex = currentIndex - 5;
          break;
        case 'Enter': {
          const content = {
            title: item.dataset.title || '',
            imgUrl: item.dataset.imageUrl || '',
            releaseYear: item.dataset.releaseYear,
          };
          openDialogWithContent(content);
          break;
        }
        default:
          break;
      }
      if (nextIndex >= 0 && nextIndex < items.length) {
        items[nextIndex].focus();
      }
    });
  }
}

/**
 * Sends content to the dialog and opens
 * @param {Object} content
 */
function openDialogWithContent(content) {
  const dialog = document.querySelector('custom-dialog');
  dialog.open(content);
}
