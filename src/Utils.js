import Colors from "./Colors.js";

export default class Utils {

  static assert(condition: boolean, message: string) {
    if (!condition) {
      console.log('ACK!', message);
      alert('ACK! ' + message)
    }
  }

  static makeImageUri(colors: any[][]): string {
    let width = -1;
    for (let row of colors) {
      if (row.length > width) {
        width = row.length;
      }
    }
    let height = colors.length;
    let buffer = new Uint8ClampedArray(width * height * 4); // have enough bytes

    for (let y = 0; y < height; y++) {
      let genSize = colors[y].length;
      let leftBuffer = Math.floor((width - genSize)/2);
      let rightBuffer = width - genSize - leftBuffer;
      for (let x = 0; x < genSize; x++) {
          let c = colors[y][x];
          let pos = (y * width + leftBuffer + x) * 4; // position in buffer based on x and y
          buffer[pos  ] = Colors.r(c);   // some R value [0, 255]
          buffer[pos+1] = Colors.g(c);   // some G value
          buffer[pos+2] = Colors.b(c);   // some B value
          buffer[pos+3] = Colors.a(c);   // set alpha channel
      }
      for (let x = 0; x < leftBuffer; x++) {
        let pos = (y * width + x) * 4;
        buffer[pos]   = 255;
        buffer[pos+1] = 255;
        buffer[pos+2] = 255;
        buffer[pos+3] = 255;
      }
      for (let x = genSize + rightBuffer; x < width; x++) {
        let pos = (y * width + x) * 4;
        buffer[pos]   = 255;
        buffer[pos+1] = 255;
        buffer[pos+2] = 255;
        buffer[pos+3] = 255;
      }
    }

    // create off-screen canvas element
    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // create imageData object
    let idata = ctx.createImageData(width, height);

    // set our buffer as source
    idata.data.set(buffer);

    // update canvas with new data
    ctx.putImageData(idata, 0, 0);

    return canvas.toDataURL()
  }

  static arraysEqual(array1: any[], array2: any[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      let o1 = array1[i];
      let o2 = array2[i];
      let eq = (o1 === o2);
      if (Array.isArray(o1) && Array.isArray(o2)) {
        eq = Utils.arraysEqual(o1, o2);
      }

      if (!eq) {
        return false;
      }
    }
    return true;
  }
}