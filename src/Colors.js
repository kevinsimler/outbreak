import Color from 'color'

export default class Colors {
  static makeHex(hexString: string): any {
    let c = Color(hexString);
    return [c.red(), c.green(), c.blue()];
  }

  static makeRGB(r: number, g: number, b: number): any {
    // return Color.rgb(r, g, b);
    return [r, g, b];
  }

  static makeHSL(h: number, s: number, l: number): any {
    // return Color.hsl(h, s, l);
    let c = Color.hsl(h, s, l);
    return [c.red(), c.green(), c.blue()];
  }

  static blend(c1: any, c2: any, fraction: number): any {
    let r = (c2[0] - c1[0]) * fraction + c1[0];
    let g = (c2[1] - c1[1]) * fraction + c1[1];
    let b = (c2[2] - c1[2]) * fraction + c1[2];
    return [r, g, b]
  }

  static withAlpha(color: any, alpha: number): any {
    return [color[0], color[1], color[2], alpha]
  }

  static r(color: any): number {
    // return color.red();
    return color[0];
  }

  static g(color: any): number {
    // return color.green();
    return color[1];
  }

  static b(color: any): number {
    // return color.blue();
    return color[2];
  }

  static a(color: any): number {
    if (color.length === 4) {
      return color[3];
    } else {
      return 255;
    }
  }

  static hue(color: any): number {
    let r = color[0] / 255,
        g = color[1] / 255,
        b = color[2] / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return h;
  }

  static __helperRep(color: any): Color {
    return Color.rgb(Colors.r(color), Colors.g(color), Colors.b(color), Colors.a(color));
  }

  static __fromHelperRep(rep: Color): any {
    return [rep.red(), rep.green(), rep.blue()]
  }

  static hex(color: any): string {
    return Colors.__helperRep(color).toString();
  }

  static opacity(color: any): number {
    let alpha = Colors.a(color);
    return alpha / 255.0;
  }

  static lighten(color: any, ratio: number): any {
    return Colors.__fromHelperRep(Colors.__helperRep(color).whiten(ratio))
  }
}