import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Link,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";

import { Page } from "../components/layout/Page";
import { useSnackbar } from "../contexts/SnackbarContext";
import { JsonImportForm } from "../features/import/components/JsonImportForm";
import { ManualImportForm } from "../features/import/components/ManualImportForm";
import { useImporter } from "../features/import/hooks/useImporter";
import { useClipboard } from "../hooks/useClipboard";
import { useTicketsStore } from "../store/ticketsStore";
import { Ticket } from "../types";

const bookmarkletCode = `javascript:(function(){const t='https://monadnadnad.github.io/iidx-rlt/bookmarklet.js?v='+new Date().getTime();const e=document.createElement('script');e.src=t;document.body.appendChild(e);})();`;

export const TicketImporterPage: React.FC = () => {
  const setTickets = useTicketsStore((s) => s.setTickets);
  const addTicket = useTicketsStore((s) => s.addTicket);

  const { showSnackbar } = useSnackbar();

  const { copyToClipboard } = useClipboard();

  const { state, importTickets } = useImporter(setTickets);
  const [jsonText, setJsonText] = useState("");

  const [isManualLoading, setIsManualLoading] = useState(false);

  const handleManualImport = (ticket: Ticket): void => {
    try {
      setIsManualLoading(true);
      addTicket(ticket);
      showSnackbar(`${ticket.laneText} を追加しました。`, "success");
      ReactGA.event({
        category: "User",
        action: "manual_import",
      });
    } catch {
      showSnackbar("チケットの追加に失敗しました。", "error");
    } finally {
      setIsManualLoading(false);
    }
  };

  useEffect(() => {
    if (state.status === "success") {
      setJsonText("");
      showSnackbar(`${state.importedCount}件のチケットをインポートしました。`, "success");
      ReactGA.event({
        category: "User",
        action: "import_tickets_success",
        value: state.importedCount,
      });
    } else if (state.status === "error" && state.error) {
      showSnackbar(state.error, "error");
    }
  }, [state.status, state.error, state.importedCount, showSnackbar]);

  return (
    <Page title="インポート">
      <Typography variant="h6" component="h2" gutterBottom>
        ブックマークレットで取り込む
        <Alert severity="warning" sx={{ my: 1 }}>
          URL変更に伴い、以前のブックマークレットは動作しません。お手数ですが下記のものを再登録してください。
        </Alert>
      </Typography>
      <Stepper orientation="vertical">
        <Step active>
          <StepLabel>
            <Typography variant="h6" component="h3">
              ブックマークレットの登録と実行
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography>IIDX公式サイトで以下のブックマークレットを実行し、結果をコピーしてください</Typography>
            <Box sx={{ mt: 1, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ bgcolor: "action.hover", px: 2, py: 0.5 }}>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => void copyToClipboard(bookmarkletCode)}
                >
                  コピー
                </Button>
              </Box>
              <Box sx={{ p: 2, wordBreak: "break-all", bgcolor: "action.hover" }}>{bookmarkletCode}</Box>
            </Box>
            <Alert severity="info" sx={{ mt: 1 }}>
              <AlertTitle>補足</AlertTitle>
              <Typography color="text.secondary" variant="body2" component="div">
                コピーしたコードをURLにしたブックマークを作成してください。
                <br />
                その後、IIDX公式サイトでブックマークを開くことで実行されます。
                <br />
                ブックマークレットの説明自体は外部サイトを確認してください。
                <br />
                Androidでブックマークレットがうまく動作しない場合は
                <Link href="https://gcgx.games/web/bookmarklet2.html" target="_blank" rel="noopener noreferrer">
                  こちらのサイト
                </Link>
                を参考にしてみてください。
              </Typography>
            </Alert>
          </StepContent>
        </Step>
        <Step active>
          <StepLabel>
            <Typography variant="h6" component="h3">
              結果を貼り付けてインポートする
            </Typography>
          </StepLabel>
          <StepContent>
            <JsonImportForm
              jsonText={jsonText}
              onTextChange={setJsonText}
              onImportClick={() => void importTickets(jsonText)}
              isLoading={state.status === "loading"}
            />
          </StepContent>
        </Step>
      </Stepper>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        手動でチケットを追加する
      </Typography>
      <ManualImportForm isLoading={isManualLoading} onImport={handleManualImport} />
    </Page>
  );
};
