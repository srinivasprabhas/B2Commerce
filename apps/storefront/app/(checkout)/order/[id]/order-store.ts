const noop = () => () => {};

/** The last order placed in this tab (saved by checkout), read without an effect. */
export const lastOrderStore = {
  subscribe: noop,
  getSnapshot: () => sessionStorage.getItem("b2c-last-order"),
  getServerSnapshot: () => null,
};
