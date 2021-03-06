import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import makeReducer from 'universal/redux/makeReducer';
import createEngine from 'redux-storage-engine-localstorage';
import {APP_NAME} from 'universal/utils/clientOptions';
import {createMiddleware, createLoader} from 'redux-storage-whitelist-fn';

const storageWhitelist = type => {
  const whitelistPrefixes = ['@@auth', '@@cashay', '@@root'];
  for (let i = 0; i < whitelistPrefixes.length; i++) {
    const prefix = whitelistPrefixes[i];
    if (type.indexOf(prefix) !== -1) {
      return true;
    }
  }
  return false;
};
export default async initialState => {
  let store;
  const reducer = makeReducer();
  const engine = createEngine(APP_NAME);
  const storageMiddleware = createMiddleware(engine, [], storageWhitelist);
  /*
   * Special action types, such as thunks, must be placed before
   * storageMiddleware so they can be properly interpreted:
   */
  const middlewares = [
    thunkMiddleware,
    storageMiddleware,
  ];

  if (__PRODUCTION__) {
    store = createStore(reducer, initialState, compose(applyMiddleware(...middlewares)));
  } else {
    const devtoolsExt = global.devToolsExtension && global.devToolsExtension();
    if (!devtoolsExt) {
      // We don't have the Redux extension in the browser, show the Redux logger
      const createLogger = require('redux-logger'); // eslint-disable-line global-require
      const logger = createLogger({
        level: 'info',
        collapsed: true
      });
      middlewares.push(logger);
    }
    store = createStore(reducer, initialState, compose(
      applyMiddleware(...middlewares),
      devtoolsExt || (f => f),
    ));
  }
  const load = createLoader(engine);
  await load(store);
  return store;
};
