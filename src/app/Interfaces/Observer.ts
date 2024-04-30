interface Observer {
  destroy(): void;
  trigger(): void;
}

export { Observer };
