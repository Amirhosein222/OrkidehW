const lastIndexOf = (array, key) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i].type === key) {
      return i;
    }
  }
  return -1;
};

export default lastIndexOf;
