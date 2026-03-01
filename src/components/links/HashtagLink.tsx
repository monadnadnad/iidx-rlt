import { Link, type LinkProps } from "@mui/material";

import { trackHashtagClick } from "../../analytics/events";

export type HashtagLinkProps = Omit<LinkProps, "href" | "target" | "rel" | "aria-label" | "children">;

const handleHashtagClick = () => {
  trackHashtagClick();
};

export const HashtagLink = (props: HashtagLinkProps) => {
  return (
    <Link
      href="https://twitter.com/search?q=%23RLTManager"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RLTManager"
      onClick={handleHashtagClick}
      {...props}
    >
      #RLTManager
    </Link>
  );
};
