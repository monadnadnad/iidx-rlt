import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Link,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ReactGA from "react-ga4";

import { Page } from "../components/layout/Page";
import { useSnackbarStore } from "../store/snackbarStore";
import { JsonImportForm } from "../features/import/components/JsonImportForm";
import { ManualImportForm } from "../features/import/components/ManualImportForm";
import { useImporter } from "../features/import/hooks/useImporter";
import { useClipboard } from "../hooks/useClipboard";
import { useTicketsStore } from "../store/ticketsStore";
import { Ticket } from "../types";

const bookmarkletCode = `javascript:(function(){const t='https://monadnadnad.github.io/iidx-rlt/bookmarklet.js?v='+new Date().getTime();const e=document.createElement('script');e.src=t;document.body.appendChild(e);})();`;

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      id={`ticket-importer-tabpanel-${index}`}
      aria-labelledby={`ticket-importer-tab-${index}`}
      hidden={value !== index}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const getA11yProps = (index: number) => ({
  id: `ticket-importer-tab-${index}`,
  "aria-controls": `ticket-importer-tabpanel-${index}`,
});

export const TicketImporterPage: React.FC = () => {
  const setTickets = useTicketsStore((s) => s.setTickets);
  const addTicket = useTicketsStore((s) => s.addTicket);

  const showSnackbar = useSnackbarStore((s) => s.show);

  const { copyToClipboard } = useClipboard();

  const { state, importTickets } = useImporter(setTickets, {
    onSuccess: (importedCount) => {
      setJsonText("");
      showSnackbar(`${importedCount}件のチケットをインポートしました。`, "success");
      ReactGA.event("import_tickets_success", {
        imported_count: importedCount,
      });
    },
    onError: (errorMessage) => {
      showSnackbar(errorMessage, "error");
    },
  });
  const [jsonText, setJsonText] = useState("");

  const [isManualLoading, setIsManualLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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

  return (
    <Page title="インポート">
      <Typography variant="h6" component="h1" gutterBottom>
        チケットを追加する
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={(_, nextTab: number) => setActiveTab(nextTab)} variant="fullWidth">
          <Tab label="ブックマークレット" {...getA11yProps(0)} />
          <Tab label="手入力する" {...getA11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          URL変更に伴い、以前のブックマークレットは動作しません。お手数ですが下記のものを再登録してください。
        </Alert>
        <Stepper orientation="vertical">
          <Step active>
            <StepLabel>
              <Typography variant="h6" component="h2">
                ブックマークレットの登録と実行
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography>IIDX公式サイトで以下のブックマークレットを実行してください</Typography>
              <Box sx={{ mt: 1, border: 1, borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
                <Box sx={{ px: 1, py: 0.5, borderBottomColor: "divider", borderBottom: 1, borderColor: "divider" }}>
                  <Button size="small" startIcon={<ContentCopyIcon />} onClick={() => copyToClipboard(bookmarkletCode)}>
                    コピー
                  </Button>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: 2,
                    bgcolor: "action.hover",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    fontSize: "0.875rem",
                  }}
                >
                  <code>{bookmarkletCode}</code>
                </Box>
              </Box>
              <Alert severity="info" sx={{ mt: 1 }}>
                <AlertTitle>補足</AlertTitle>
                <Typography color="text.secondary" variant="body2" component="div">
                  IIDX公式サイトで、上記をURLにしたブックマークを作成してください。
                  <br />
                  Androidでうまく動作しない場合の対処法や、ブックマークレットの説明自体は
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
              <Typography variant="h6" component="h2">
                結果を貼り付けてインポートする
              </Typography>
            </StepLabel>
            <StepContent>
              <JsonImportForm
                jsonText={jsonText}
                onTextChange={setJsonText}
                onImportClick={() => importTickets(jsonText)}
                isLoading={state.status === "loading"}
              />
            </StepContent>
          </Step>
        </Stepper>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <ManualImportForm isLoading={isManualLoading} onImport={handleManualImport} />
      </TabPanel>
    </Page>
  );
};
