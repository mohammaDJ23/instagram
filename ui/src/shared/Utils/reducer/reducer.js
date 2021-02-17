export const lists = (arr, chunk) => {
  return arr.reduce((accumulator, currentValue, index) => {
    const chunkIndex = Math.floor(index / chunk);

    if (!accumulator[chunkIndex]) {
      accumulator[chunkIndex] = [];
    }

    accumulator[chunkIndex].push(currentValue);
    return accumulator;
  }, []);
};
