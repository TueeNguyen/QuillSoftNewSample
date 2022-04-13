/**
 * @param {Blob} file 
 * @returns {Uint8Array}
 * 
 * Converts file blob into Uint8Array to reserve its orginial state.
 * !Important: Currently not used in the file.
 */


async function fileToBinary(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result;
      const uint8Array = new Uint8Array(arrayBuffer);

      resolve(uint8Array);
    };
    fileReader.onerror = reject;
  });
}

export { fileToBinary };