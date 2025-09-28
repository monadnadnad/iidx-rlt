export interface UpdateHistoryEntry {
  id: string;
  releasedAt: string;
  title: string;
  summary: string;
  details?: string[];
}

export const updateHistory = [
  {
    id: "site-migration",
    releasedAt: "2025-09-27",
    title: "サイト移転しました",
    summary: "GitHubリポジトリの移動に伴いURLが変わりました。",
    details: [
      "ブックマークレットの更新が必要なことなど、既存ユーザー向けの注意点を各ページに記載しました",
      "旧URLはしばらくの間、既存ユーザーのService Workerの解除と本URLへのリダイレクトを配置しています",
    ],
  },
  {
    id: "manual-import",
    releasedAt: "2025-08-25",
    title: "チケットを手動登録できるようにしました",
    summary: "ブックマークレットが意外と障壁とわかったので、手動でチケットを登録できるようにしました。",
    details: ["無料チケットで数枚だけ持っている人向け", "ブックマークレットが面倒で障壁に感じる人向け"],
  },
  {
    id: "recommend-improvements",
    releasedAt: "2025-08-12",
    title: "曲からチケットを絞り込む機能を追加",
    summary: "当たり配置を定義してある曲からチケットを絞り込めるようにしました。",
    details: ["「おすすめから検索」で曲を選ぶとチケットが絞りこまれます"],
  },
  {
    id: "pagination",
    releasedAt: "2025-08-12",
    title: "チケット一覧にページ分割を追加",
    summary: "千枚単位でチケットをインポートするととても重かったので、ページネーションを追加しました。",
  },
  {
    id: "first-release",
    releasedAt: "2025-07-18",
    title: "一般公開",
    summary: "知識がなくてもランダムレーンチケットの活用先を見つけられるようなツールとして公開しました。",
  },
] satisfies ReadonlyArray<UpdateHistoryEntry>;
