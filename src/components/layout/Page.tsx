import { type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";

interface PageProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

const SITE_NAME = "RLT Manager";
const SITE_URL = "https://monadnadnad.github.io/iidx-rlt";

export const Page: React.FC<PageProps> = ({ title, description, children }) => {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
  const pageDescription = description ?? "beatmania IIDXのランダムレーンチケット活用支援、当たり配置候補の推薦";
  const { pathname } = useLocation();
  const canonicalUrl = `${SITE_URL}${pathname}`;

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      {children}
    </>
  );
};
