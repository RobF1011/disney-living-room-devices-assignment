import attachEventListeners from './utils'

class HomePage extends HTMLElement {

  constructor() {
    super();
    this.intersectionObserver = null;
  }

  connectedCallback() {
    this.showLoadingScreen();
    this.fetchHomeContent();
  }

  /**
   * Builds the loading screen HTML and appends to the body
   */
  showLoadingScreen() {
    const loaderWrapper = document.createElement('div');
    loaderWrapper.classList.add('loader-wrapper');
    const loaderHTML = `
      <div class="loader"></div>
      <div class="firework"></div>
      <div class="firework"></div>
      <div class="firework"></div>
    `
    loaderWrapper.innerHTML = loaderHTML;
    document.body.appendChild(loaderWrapper)
    document.body.style.overflow = "hidden";
  }

  /**
   * Removes the loader from the DOM
   */
  hideLoadingScreen() {
    // Example to simulate longer loading times
    setTimeout(() => {
      const loader = document.querySelector('.loader-wrapper');
      loader.remove();
      document.body.style.overflow = "visible";
    }, 3000);
  }

  /**
   * Fetches the Home content
   */
  async fetchHomeContent() {
    try {
      const response = await fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json');
      const homeData = await response.json();
      const homeCollection = homeData.data.StandardCollection;
      await this.renderContent(homeCollection);
      this.hideLoadingScreen();
    } catch (error) {
      console.error('Error fetching home page data:', error);
    }
  }

  /**
   * Fetches the refId content
   * @param {String} refId
   * @returns {Array} refSet
   */
  async fetchRefContent(refId) {
    const response = await fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${refId}.json`);
    const refData = await response.json();
    const refType = Object.keys(refData.data)[0];
    const refSet = refData.data[refType];
    return refSet;
  }

  /**
   * Uses the Home data to build the HTML for each collection 
   * @param {Array} data
   */
  async renderContent(data) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < data.containers.length; i++) {
      const collection = data.containers[i];
      
      if (collection.set.refId) {
        // Create a placeholder for the ref data
        const placeholder = document.createElement('div');
        placeholder.classList.add('collection');
        const placeholderHTML = `
          <h3 class="collection-title">Placeholder</h3>
          <ul class="collection-row">
            <li class="collection-item">
              <img src="https://fakeimg.pl/500x281">
            </li>
          </ul>
        `;
        placeholder.innerHTML = placeholderHTML;
        fragment.appendChild(placeholder);

        // Start observing the placeholder
        this.observePlaceholder(placeholder, collection.set.refId);
        continue;
      }
      const collectionContainer = document.createElement('div');
      collectionContainer.classList.add('collection');
      collectionContainer.setAttribute('data-collection-id', collection.set.setId);
      collectionContainer.setAttribute('data-collection-title', collection.set.text?.title?.full?.set?.default?.content || 'No Title');

      const collectionHtml = `
        <h3 class="collection-title">${collection.set.text?.title?.full?.set?.default?.content || 'No Title'}</h3>
        <ul class="collection-row"></ul>
      `;
      collectionContainer.innerHTML = collectionHtml;

      fragment.appendChild(collectionContainer);
      const collectionItems = collection.set.items || [];
      this.renderCollectionItems(collectionItems, collectionContainer);
    }

    this.appendChild(fragment);
    // Attach event listeners
    const allItems = this.querySelectorAll('.collection-item');
    attachEventListeners(allItems);

    const firstCollectionItem = this.querySelector('.collection-item');
    firstCollectionItem.focus();
  }

  /**
   * Sets up the Intersection Observer to observe each placeholder 
   * @param {HTMLDivElement} placeholder
   * @param {String} refId
   */
  async observePlaceholder(placeholder, refId) {
    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stop observing once it's in view
          this.intersectionObserver.unobserve(placeholder);
          // Fetch reference content data
          this.fetchRefContent(refId)
            .then(data => {
              // Render the reference content data
              this.renderRefContent(data, placeholder);
            })
            .catch(error => {
              console.error('Error fetching ref content:', error);
            });
        }
      });
    }, {rootMargin: '400px'});

    this.intersectionObserver.observe(placeholder);
  }

  /**
   * renders the ref content 
   * @param {Array} data
   * @param {HTMLDivElement} placeholder
   */
  renderRefContent(data, placeholder) {
    const refCollectionTitle = data.text?.title?.full?.set?.default?.content || 'No Title';
    const refCollectionItems = data.items || [];

    placeholder.firstElementChild.innerHTML = refCollectionTitle;

    this.renderCollectionItems(refCollectionItems, placeholder);

    // Re-attach event listeners
    const allItems = this.querySelectorAll('.collection-item');
    attachEventListeners(allItems);
  }

  /**
   * Takes each collection item and appends to the collection row 
   * @param {Array} collectionItems
   * @param {HTMLDivElement} collectionContainer
   */
  renderCollectionItems(collectionItems, collectionContainer) {
    const collectionRow = collectionContainer.querySelector('.collection-row');
    collectionRow.innerHTML = ''; // Clear existing items

    for (let i = 0; i < collectionItems.length; i++) {
      const item = collectionItems[i];
      collectionRow.appendChild(this.createCollectionItem(item));
    }
  }

  /**
   * Creates the collection item LI element 
   * @param {Array} item
   * @returns {HTMLLIElement}
   */
  createCollectionItem(item) {
    const subItemType = Object.keys(item.text?.title?.full || {})[0];
    const tileImagePath = item.image.tile['1.78'];
    const tileImageUrl = tileImagePath[subItemType]?.default?.url || tileImagePath.default?.default?.url;
    const title = item.text?.title?.full[subItemType]?.default?.content;
    const releases = item.releases || {};
    const releaseYear = releases[0]?.releaseYear || '';

    const listItem = document.createElement('li');
    listItem.classList.add('collection-item');
    listItem.tabIndex = 1;
    listItem.dataset.title = title;
    listItem.dataset.releaseYear = releaseYear;
    listItem.dataset.imageUrl = tileImageUrl;
    listItem.innerHTML = `
          <img src="${tileImageUrl}" alt="${title}">
    `;

    // Attach error event listener to the image
    const image = listItem.querySelector('img');
    image.addEventListener('error', () => {
        // If image fails to load, replace with fallback image
        image.src = '../images/wrecked.jpg';
    });

    return listItem;
  }
}

customElements.define('home-page', HomePage);
