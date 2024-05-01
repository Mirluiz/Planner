export type Color = {
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
  light_yellow: 0xfff000;
  light_grey: 0xc6c6c6;
  grey: 0x777777;
  white: 0xffffff;
};

class ColorManager {
  static pickedColor: number[] = [];
  static readonly colors: { [key in keyof Color]: number } = {
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
    light_yellow: 0xfff000,
    light_grey: 0xc6c6c6,
    grey: 0x777777,
    white: 0xffffff,
  };

  static pick(): number {
    if (Object.values(this.colors).length === this.pickedColor.length) {
      this.pickedColor = [];
    }

    let lastIndex = this.pickedColor.length;

    const color = Object.values(this.colors)[lastIndex];

    this.pickedColor.push(color);
    return color ?? this.colors["light_yellow"];
  }

  static getNameByNumber(value: number) {
    let result = Object.values(this.colors).findIndex(
      (color) => color === value,
    );
    let key = Object.keys(this.colors)[result];

    return key ?? "black";
  }
}

export { ColorManager };
