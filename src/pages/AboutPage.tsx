import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import { Page } from "../components/layout/Page";
import { GitHubLink } from "../components/links/GitHubLink";
import { XLink } from "../components/links/XLink";

export const AboutPage = () => {
  return (
    <Page title="About">
      <Box sx={{ px: 2, py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ flexGrow: 1 }}>
            このツールについて
          </Typography>
          <GitHubLink />
          <XLink />
        </Box>
        <Typography>
          KONAMI の音楽ゲーム beatmania IIDX のランダムレーンチケットの活用を目的とした非公式サイトです。
        </Typography>
        <Box component="details" sx={{ mt: 2 }}>
          <Box component="summary" sx={{ cursor: "pointer" }}>
            ランダムレーンチケットとは
          </Box>
          <Typography sx={{ mt: 1, pl: 2 }}>
            通常、プレイごとに譜面が変わるRANDOMオプションに対し、譜面をチケット記載の配置に固定できる課金アイテムです。
            <Link
              href="https://p.eagate.573.jp/game/2dx/33/howto/lightning_model/random_lane.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              IIDX公式のヘルプページ
            </Link>
            で詳細が確認できます。
          </Typography>
        </Box>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          こんな人向け
        </Typography>
        <List>
          {[
            "グッズキャンペーンのためにチケットを大量に購入したが、どの曲で使えばいいのか分からない",
            "チケットを絞り込んで、あの曲で当たり配置になるものがあるか確認したい",
            "このチケットを使うとあの曲の譜面はどうなるのか、をプレイ前に確認したい",
          ].map((text, idx) => (
            <ListItem key={idx} disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          使い方
        </Typography>
        <Stepper orientation="vertical" sx={{ mt: 2 }}>
          <Step active>
            <StepLabel>
              <Typography variant="h6" component="h3">
                チケットのインポート
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography>
                「インポート」にあるブックマークレットを使い、公式サイトからチケットを取り込みます。
              </Typography>
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              <Typography variant="h6" component="h3">
                チケットの使用先を探す
              </Typography>
            </StepLabel>
            <StepContent>
              <List>
                {[
                  [
                    "当たり配置候補の確認",
                    "チケット一覧で各チケットをクリックすると、当たり配置になりうる曲の候補が表示されるので参考にしてください。",
                  ],
                  [
                    "チケットの絞り込み",
                    "「皿側が135」「2が左手側で、3が右手側」のような条件でチケットを絞り込めます。譜面の知識があってチケットを絞り込めれば十分な人向けの機能です。",
                  ],
                ].map((texts, idx) => (
                  <ListItem key={idx} disableGutters>
                    <ListItemIcon sx={{ minWidth: 40, alignSelf: "flex-start", mt: 1 }}>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={texts[0]} secondary={texts[1]} />
                  </ListItem>
                ))}
              </List>
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              <Typography variant="h6" component="h3">
                譜面の確認
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" component="p" sx={{ mt: 2 }}>
                チケット一覧の上にある「楽曲を選択」から曲を選ぶと表示されるアイコン
                <LaunchIcon fontSize="inherit" sx={{ verticalAlign: "middle", mx: 0.25 }} />
                から、外部サイト
                <Link href="https://textage.cc/" target="_blank" rel="noopener noreferrer">
                  Textage
                </Link>
                で譜面を確認できます。
              </Typography>
            </StepContent>
          </Step>
        </Stepper>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          データ参照元
        </Typography>
        <Typography component="p" sx={{ mt: 2 }}>
          譜面URLや楽曲メタデータは
          <Link href="https://textage.cc/" target="_blank" rel="noopener noreferrer">
            Textage.cc
          </Link>
          様に帰属し、
          <Link href="https://chinimuruhi.github.io/IIDX-Data-Table/" target="_blank" rel="noopener noreferrer">
            IIDX Data Table
          </Link>{" "}
          様から提供されているデータを元に加工して使用させて頂いています。
          <br />
          URLへの短時間での大量アクセスなど、Textage 様へのご迷惑となる行為はお控えください。
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          プライバシーポリシー
        </Typography>
        <Typography>
          利用状況調査のためGoogleアナリティクスを利用しています。
          Cookieを無効にすることで収集を拒否することが出来ます。 この規約に関しての詳細は
          <Link
            href="https://marketingplatform.google.com/about/analytics/terms/jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Googleアナリティクスサービスの利用規約
          </Link>
          や
          <Link href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            Googleポリシーと規約ページ
          </Link>
          をご確認ください。
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Typography variant="caption" color="text.secondary" component="p">
          beatmaniaは株式会社コナミデジタルエンタテインメントの登録商標です。
          本サイトは当該法人および関連企業とは一切関係ありません。
        </Typography>
        <Typography variant="caption" color="text.secondary" component="p">
          本サイトはオープンソースソフトウェアを利用しています。
          <Link
            href="https://github.com/monadnadnad/iidx-rlt/blob/main/THIRD_PARTY_NOTICES.txt"
            target="_blank"
            rel="noopener noreferrer"
          >
            ライセンス情報
          </Link>
        </Typography>
      </Box>
    </Page>
  );
};
