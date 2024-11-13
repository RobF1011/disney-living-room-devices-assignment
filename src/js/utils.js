import globalState from './state/globalState';

/**
 * Attaches the keydown event listeners for all collection items
 * @param {NodeListOf<Element>} allItems
 */
export default function attachEventListeners(allRows) {
  const throttledKeyDown = throttle(handleKeydown, 300);
  allRows.forEach((row, rowIndex) => {
    const items = row.querySelectorAll('.collection-item');
    items.forEach((item, itemIndex) => {
      if (item.dataset.eventKeydown) return;
      item.addEventListener('keydown', (event) => throttledKeyDown(event, row, rowIndex, itemIndex, item));
      item.dataset.eventKeydown = true;
    });
  });
}

function throttle(callback, delay) {
  let lastInvocationTime = 0;

  // Return a function that respects the throttle
  return function(...args) {
    const now = Date.now();
    if (now - lastInvocationTime >= delay) {
      callback.apply(this, args);
      lastInvocationTime = now;
    }
  };
}

function handleKeydown(event, row, rowIndex, itemIndex, item) {
  event.preventDefault();
  const rows = document.querySelectorAll('.collection-row');
  switch (event.key) {
    case 'ArrowRight':
      // event.preventDefault();
      // event.stopPropagation();
      navigateRight(row, itemIndex);
      globalState.increaseIndex();
      console.log('** global index Arrow Right', globalState.itemIndex);
      break;
    case 'ArrowLeft':
      // event.preventDefault();
      // event.stopPropagation();
      navigateLeft(row, itemIndex);
      globalState.decreaseIndex();
      console.log('** global index Arrow Left', globalState.itemIndex);
      break;
    case 'ArrowDown':
      navigateVertical(rows, rowIndex, 'down');
      console.log('** global index Arrow Down', globalState.itemIndex);
      break;
    case 'ArrowUp':
      navigateVertical(rows, rowIndex, 'up');
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
}

function navigateRight(row, itemIndex) {
  const items = row.querySelectorAll('.collection-item');

  if (itemIndex < 0 || itemIndex >= items.length) return;

  const newItemIndex = itemIndex + 1; // Move to the next item
  if (newItemIndex >= items.length) {
    // Optionally loop to the first item or handle as needed
    return;
  }

  const targetItem = items[newItemIndex];
  targetItem.focus();

  // Calculate whether the next item is out of the visible area
  const rowRect = row.getBoundingClientRect();
  const targetItemRect = targetItem.getBoundingClientRect();
  // Scroll if the next item's right edge is beyond the row's visible right edge
  if (targetItemRect.right > rowRect.right) {
    // Calculate the scroll amount needed to bring the next item fully into view
    const scrollAmount = targetItemRect.width + 50;
    scrollRow(row, 'right', scrollAmount);
  }
}

function navigateLeft(row, itemIndex) {
  const items = row.querySelectorAll('.collection-item');

  if (itemIndex <= 0 || itemIndex >= items.length) return; // No item to the left

  const newItemIndex = itemIndex - 1; // Move to the previous item
  const targetItem = items[newItemIndex];
  targetItem.focus();

  const targetItemRect = targetItem.getBoundingClientRect();

  // Scroll if the next item's left edge is before the row's visible left edge
  if (targetItemRect.left <= 78 && row.scrollLeft > 0) {
    // Calculate the scroll amount needed to bring the next item fully into view
    // Negative value for scrolling left
    const scrollAmount = targetItemRect.width + 50;
    scrollRow(row, 'left', scrollAmount);
  }
}

function navigateVertical(rows, currentRowIndex, direction) {
  console.log('** global index navigateVertical', globalState.itemIndex);
  // if (currentRowIndex < 0 || currentRowIndex >= rows.length - 1) return;

  const selectedRow = direction === 'down' ? rows[currentRowIndex + 1] : rows[currentRowIndex - 1];
  if (!selectedRow) return; // No next row available
  const firstChildRect = selectedRow.children[0].getBoundingClientRect();
  const offset = firstChildRect.left < 0 ? Math.ceil(Math.abs(firstChildRect.left) / 362) : 0;
  const newItemIndex = globalState.itemIndex + offset;

  const newItem = selectedRow.children[newItemIndex];

  // If new item is too low on screen, scroll down
  if (direction === 'down' && newItem.getBoundingClientRect().top > 600) {
    window.scrollBy({ top: 350, behavior: 'smooth' });
  }
  // If new item is too high on screen, scroll up
  if (direction === 'up' && newItem.getBoundingClientRect().top < 300) {
    window.scrollBy({ top: -350, behavior: 'smooth' });
  }

  newItem.focus();
}

function scrollRow(row, direction, scrollAmount) {
  row.scrollBy({
    left: direction === 'right' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  });
}

/**
 * Sends content to the dialog and opens
 * @param {Object} content
 */
function openDialogWithContent(content) {
  const dialog = document.querySelector('custom-dialog');
  dialog.open(content);
}
