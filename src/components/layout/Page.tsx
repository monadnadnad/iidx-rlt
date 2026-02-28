import { type ReactNode } from "react";

interface PageProps {
  title?: string;
  children: ReactNode;
}

export const Page: React.FC<PageProps> = ({ title, children }) => {
  const fullTitle = title ? `${title} - RLT Manager` : "RLT Manager";

  return (
    <>
      <title>{fullTitle}</title>
      {children}
    </>
  );
};
