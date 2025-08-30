import { useCallback, useReducer } from "react";

import { Ticket } from "../../../types";

export type ImporterState = {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  importedCount: number;
};

type Action =
  | { type: "START_IMPORT" }
  | { type: "IMPORT_SUCCESS"; payload: { count: number } }
  | { type: "IMPORT_ERROR"; payload: { error: string } }
  | { type: "RESET" };

const initialState: ImporterState = {
  status: "idle",
  error: null,
  importedCount: 0,
};

const reducer = (state: ImporterState, action: Action): ImporterState => {
  switch (action.type) {
    case "START_IMPORT":
      return { ...initialState, status: "loading" };
    case "IMPORT_SUCCESS":
      return { ...state, status: "success", importedCount: action.payload.count };
    case "IMPORT_ERROR":
      return { ...state, status: "error", error: action.payload.error };
    case "RESET":
      return initialState;
    /* v8 ignore next 2 */
    default:
      return state;
  }
};

export const useImporter = (onImport: (tickets: Ticket[]) => void) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const importTickets = useCallback(
    (jsonText: string) => {
      dispatch({ type: "START_IMPORT" });

      if (!jsonText.trim()) {
        dispatch({ type: "IMPORT_ERROR", payload: { error: "インポートするチケットデータがありません。" } });
        return;
      }

      try {
        const parsedData = JSON.parse(jsonText) as Ticket[];
        if (!Array.isArray(parsedData)) {
          dispatch({ type: "IMPORT_ERROR", payload: { error: "データが配列形式になっていません。" } });
          return;
        }
        onImport(parsedData);
        dispatch({ type: "IMPORT_SUCCESS", payload: { count: parsedData.length } });
      } catch (e) {
        const errorMessage =
          e instanceof SyntaxError
            ? "チケットデータの形式が正しくありません。公式サイトでブックマークレットを実行し、表示された内容をすべてコピーして貼り付けてください。"
            : `チケットのインポート中に予期せぬエラーが発生しました。${e as string}`;
        dispatch({ type: "IMPORT_ERROR", payload: { error: errorMessage } });
      }
    },
    [onImport]
  );

  const resetStatus = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return { state, importTickets, resetStatus };
};
