type ColorT = {
  maroon: 0x800000;
  brown: 0x9a6324;
  olive: 0x808000;
  teal: 0x469990;
  navy: 0x000075;
  black: 0x00;
  red: 0xe6194b;
  orange: 0xf58231;
  yellow: 0xffe119;
  lime: 0xbfef45;
  green: 0x3cb44b;
  cyan: 0x42d4f4;
  blue: 0x4363d8;
  purple: 0x911eb4;
  magenta: 0xf032e6;
  beige: 0xfffac8;
  lavender: 0xdcbeff;
};

class Color {
  static pickedColor: number[] = [];
  static readonly colors: { [key in keyof ColorT]: number } = {
    maroon: 0x800000,
    brown: 0x9a6324,
    olive: 0x808000,
    teal: 0x469990,
    navy: 0x000075,
    black: 0x00,
    red: 0xe6194b,
    orange: 0xf58231,
    yellow: 0xffe119,
    lime: 0xbfef45,
    green: 0x3cb44b,
    cyan: 0x42d4f4,
    blue: 0x4363d8,
    purple: 0x911eb4,
    magenta: 0xf032e6,
    beige: 0xfffac8,
    lavender: 0xdcbeff,
  };

  static pick() {
    if (Object.values(this.colors).length === this.pickedColor.length) {
      this.pickedColor = [];
    }

    let lastIndex = this.pickedColor.length;

    const color = Object.values(this.colors)[lastIndex];
    this.pickedColor.push(color);
    return color ?? 0xfff000;
  }

  static getNameByNumber(value: number) {
    let result = Object.values(this.colors).findIndex(
      (color) => color === value
    );
    let key = Object.keys(this.colors)[result];

    return key ?? "black";
  }
}

export { Color };
