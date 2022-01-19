interface Action {
  type: string;
}

interface PayloadAction<T> extends Action {
  payload: T;
}
