interface Observer {
  update(): void;
  destroy(): void;
}

export { Observer };
