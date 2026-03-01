import { useCallback, useReducer } from "react";

import { ticketSchema } from "../../../schema/ticket";
import { Ticket } from "../../../types";

export type ImportErrorType = "empty_input" | "invalid_json" | "not_array" | "invalid_ticket" | "unexpected";

export type ImporterState = {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  errorType: ImportErrorType | null;
  importedCount: number;
};

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
      const fail = (errorType: ImportErrorType, errorMessage: string) => {
        dispatch({ type: "IMPORT_ERROR", payload: { error: errorMessage, errorType } });
        onError?.(errorMessage, errorType);
      };

      dispatch({ type: "START_IMPORT" });

      if (!jsonText.trim()) {
        const errorMessage = "インポートするチケットデータがありません。";
        fail("empty_input", errorMessage);
        return;
      }

      try {
        const parsedData: unknown = JSON.parse(jsonText);
        if (!Array.isArray(parsedData)) {
          fail("not_array", "データが配列形式になっていません。");
          return;
        }
        const parsedTickets = ticketSchema.array().safeParse(parsedData);
        if (!parsedTickets.success) {
          fail(
            "invalid_ticket",
            "チケットデータ内に不正な値があります。公式サイトでブックマークレットを再実行し、表示された内容をすべてコピーして貼り付けてください。"
          );
          return;
        }
        onImport(parsedTickets.data);
        dispatch({ type: "IMPORT_SUCCESS", payload: { count: parsedTickets.data.length } });
        onSuccess?.(parsedTickets.data.length);
      } catch (e) {
        fail(
          e instanceof SyntaxError ? "invalid_json" : "unexpected",
          e instanceof SyntaxError
            ? "チケットデータの形式が正しくありません。公式サイトでブックマークレットを実行し、表示された内容をすべてコピーして貼り付けてください。"
            : `チケットのインポート中に予期せぬエラーが発生しました。${e as string}`
        );
      }
    },
    [onError, onImport, onSuccess]
  );

  const resetStatus = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return { state, importTickets, resetStatus };
};
