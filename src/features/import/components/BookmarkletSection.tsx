import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Alert, AlertTitle, Box, Button, Collapse, Link, Typography } from "@mui/material";
import React, { useState } from "react";

import { useClipboard } from "../../../hooks/useClipboard";

const bookmarkletCode = `javascript:(function(){const t='https://monadnadnad.github.io/iidx-rlt/bookmarklet.js?v='+new Date().getTime();const e=document.createElement('script');e.src=t;document.body.appendChild(e);})();`;

export const BookmarkletSection: React.FC = () => {
  const [showBookmarklet, setShowBookmarklet] = useState(false);
  const { copyToClipboard } = useClipboard();

  return (
    <>
      <Typography>IIDX公式サイトでブックマークレットを実行し、チケット情報をコピーします。</Typography>
      <Link
        component="button"
        variant="body1"
        underline="hover"
        onClick={() => setShowBookmarklet(!showBookmarklet)}
        sx={{ mt: 1 }}
      >
        ブックマークレットを表示
      </Link>
      <Collapse in={showBookmarklet}>
        <Box sx={{ mt: 1, border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ bgcolor: "action.hover", px: 2, py: 0.5 }}>
            <Button size="small" startIcon={<ContentCopyIcon />} onClick={() => void copyToClipboard(bookmarkletCode)}>
              コピー
            </Button>
          </Box>
          <Box sx={{ p: 2, wordBreak: "break-all", bgcolor: "action.hover" }}>{bookmarkletCode}</Box>
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          <AlertTitle>補足</AlertTitle>
          <Typography color="text.secondary" variant="body2" component="div">
            コピーしたコードをURLにしたブックマークを作成してください。
            その後、IIDX公式サイトでブックマークを開くことで実行されます。
            インポートされたチケットの枚数のみ、Googleアナリティクスで収集しています。
            詳細はAboutページのプライバシーポリシーをご確認ください。
          </Typography>
        </Alert>
      </Collapse>
    </>
  );
};
