import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices/root-slice'

const STORAGE_KEY = 'gameSave'

let preloadedState = undefined

try {
  preloadedState = JSON.parse(String(localStorage.getItem(STORAGE_KEY)))
} catch (e) {
  // do nothing
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedState ? preloadedState : undefined,
});

store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

declare module 'react-redux' {
  interface DefaultRootState extends RootState {
    foo: 1
  }
}

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
