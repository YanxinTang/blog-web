import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import type { Store } from 'redux';
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'
import type { AppState } from './reducers/app';
import type { AuthState } from './reducers/auth';

export type State = {
  app: AppState,
  auth: AuthState;
}
let store: Store<State> | undefined;

function initStore(initialState: State) {
  return createStore(
    reducers,
    initialState,
    applyMiddleware(thunkMiddleware),
  )
}

export const initializeStore = (preloadedState: State) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: State) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store;
}