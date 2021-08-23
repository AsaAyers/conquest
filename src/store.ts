import { configureStore } from '@reduxjs/toolkit';
import reducer from './slices/conquest'

let preloadedState = undefined

try {
  preloadedState = JSON.parse(String(localStorage.getItem('gameSave')))
} catch (e) {
  // do nothing
}

console.log(preloadedState)

export const store = configureStore({
  reducer,
  preloadedState: preloadedState ? preloadedState : undefined,
});

store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem('gameSave', JSON.stringify(state))
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
