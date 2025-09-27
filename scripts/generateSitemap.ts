import { writeFile } from "fs/promises";
import { resolve } from "path";
import { SitemapStream, streamToPromise, SitemapItemLoose } from "sitemap";

const hostname = "https://monadnadnad.github.io";

const links: SitemapItemLoose[] = [{ url: "/iidx-rlt/" }, { url: "/iidx-rlt/tickets/" }];

const main = async (): Promise<void> => {
  try {
    const stream = new SitemapStream({ hostname });
    links.forEach((link) => stream.write(link));
    stream.end();

    const data = await streamToPromise(stream);
    const sitemapPath = resolve("./dist/sitemap.xml");
    await writeFile(sitemapPath, data.toString());
    console.log(`sitemap.xml created at ${sitemapPath}`);
  } catch (e) {
    console.error(e);
  }
};

void main();
