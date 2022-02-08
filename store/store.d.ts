interface Action {
  type: string;
}

interface PayloadAction<T> extends Action {
  payload: T;
}

type PayloadType<T extends (...args: any) => any> = ReturnType<T>['payload'];

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
