const globalState = {
  itemIndex: 0,
  increaseIndex() {
    if (this.itemIndex < 4) {
      this.itemIndex++;
    }
  },
  decreaseIndex() {
    if (this.itemIndex > 0) {
      this.itemIndex--;
    }
  },
};

export default globalState;
