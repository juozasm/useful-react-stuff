import { useReducer, useCallback, useState } from "react";

enum reducerType {
  loading = "loading",
  success = "success",
  error = "error",
}

export type State = {
  isLoading: boolean;
  notAsked: boolean;
  error: null | string;
};

type Action =
  | { type: reducerType.loading }
  | { type: reducerType.success }
  | { type: reducerType.error; error: string };

type Reducer<S, A> = (prevState: S, action: A) => S;

const initialState = {
  isLoading: false,
  notAsked: true,
  error: null,
};

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case reducerType.loading:
      return {
        ...state,
        isLoading: true,
        notAsked: false,
      };
    case reducerType.success:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case reducerType.error:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    default:
      return state;
  }
}

export default function useDataFlowReducer<T>(
  initialValue: T | null | undefined = null
) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState
  );
  const [data, setData] = useState<T | null | undefined>(initialValue);

  const onSuccess = useCallback((d: T) => {
    setData(d);
    dispatch({ type: reducerType.success });
  }, []);
  const onError = useCallback(
    (error: string) => dispatch({ error, type: reducerType.error }),
    []
  );
  const onStart = useCallback(
    () => dispatch({ type: reducerType.loading }),
    []
  );

  return {
    onSuccess,
    onError,
    onStart,
    ...state,
    notAsked: !data && state.notAsked,
    data,
  };
}
