export class RNG {
  // From http://onehourhacks-gamespot.blogspot.com/2013/02/howto-make-quick-and-dirty-pseudorandom.html
  static m = 2147483648;
  static a = 214013;
  static c = 2531011;

  lastX: number;

  constructor(seed: number|null) {
    if (seed === null || seed === undefined) {
      seed = Math.floor(Math.random() * RNG.m);
    }
    this.lastX = Math.floor(seed);
  }

  random(): number {
    this.lastX = (RNG.a * this.lastX + RNG.c) % RNG.m;
    // return Math.random();
    return this.lastX / RNG.m;
  }

  randBetween(num1: number, num2: number): number {
    return this.random() * (num2-num1) + num1
  }

  // inclusive on both sides
  randIntBetween(int1: number, int2: number): number {
    let r = this.random() * (int2-int1+1)
    return Math.floor(r) + int1
  }

}