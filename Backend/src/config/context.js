const { AsyncLocalStorage } = require("async_hooks");

const asyncLocalStorage = new AsyncLocalStorage();

const run = (store, callback) => {
  asyncLocalStorage.run(store, callback);
};

const get = (key) => {
  const store = asyncLocalStorage.getStore();
  return store ? store.get(key) : undefined;
};

module.exports = {
  run,
  get,
};
