interface Action {
  type: string;
}

interface PayloadAction<T> extends Action {
  payload: T;
}

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
