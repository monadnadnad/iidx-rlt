import { useCallback, useReducer } from "react";

import { Ticket } from "../../../types";

export type ImporterState = {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  errorType: ImportErrorType | null;
  importedCount: number;
};

export type ImportErrorType = "empty_input" | "invalid_json" | "not_array" | "unexpected";

type Action =
  | { type: "START_IMPORT" }
  | { type: "IMPORT_SUCCESS"; payload: { count: number } }
  | { type: "IMPORT_ERROR"; payload: { error: string; errorType: ImportErrorType } }
  | { type: "RESET" };

const initialState: ImporterState = {
  status: "idle",
  error: null,
  errorType: null,
  importedCount: 0,
};

const reducer = (state: ImporterState, action: Action): ImporterState => {
  switch (action.type) {
    case "START_IMPORT":
      return { ...initialState, status: "loading" };
    case "IMPORT_SUCCESS":
      return { ...state, status: "success", importedCount: action.payload.count };
    case "IMPORT_ERROR":
      return { ...state, status: "error", error: action.payload.error, errorType: action.payload.errorType };
    case "RESET":
      return initialState;
    /* v8 ignore next 2 */
    default:
      return state;
  }
};

type ImporterCallbacks = {
  onSuccess?: (importedCount: number) => void;
  onError?: (errorMessage: string, errorType: ImportErrorType) => void;
};

export const useImporter = (onImport: (tickets: Ticket[]) => void, callbacks: ImporterCallbacks = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { onSuccess, onError } = callbacks;

  const importTickets = useCallback(
    (jsonText: string) => {
      dispatch({ type: "START_IMPORT" });

      if (!jsonText.trim()) {
        const errorMessage = "インポートするチケットデータがありません。";
        const errorType: ImportErrorType = "empty_input";
        dispatch({ type: "IMPORT_ERROR", payload: { error: errorMessage, errorType } });
        onError?.(errorMessage, errorType);
        return;
      }

      try {
        const parsedData = JSON.parse(jsonText) as Ticket[];
        if (!Array.isArray(parsedData)) {
          const errorMessage = "データが配列形式になっていません。";
          const errorType: ImportErrorType = "not_array";
          dispatch({ type: "IMPORT_ERROR", payload: { error: errorMessage, errorType } });
          onError?.(errorMessage, errorType);
          return;
        }
        onImport(parsedData);
        dispatch({ type: "IMPORT_SUCCESS", payload: { count: parsedData.length } });
        onSuccess?.(parsedData.length);
      } catch (e) {
        const errorType: ImportErrorType = e instanceof SyntaxError ? "invalid_json" : "unexpected";
        const errorMessage =
          e instanceof SyntaxError
            ? "チケットデータの形式が正しくありません。公式サイトでブックマークレットを実行し、表示された内容をすべてコピーして貼り付けてください。"
            : `チケットのインポート中に予期せぬエラーが発生しました。${e as string}`;
        dispatch({ type: "IMPORT_ERROR", payload: { error: errorMessage, errorType } });
        onError?.(errorMessage, errorType);
      }
    },
    [onError, onImport, onSuccess]
  );

  const resetStatus = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return { state, importTickets, resetStatus };
};
