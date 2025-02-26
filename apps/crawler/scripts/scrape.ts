import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import Turndown from "turndown";

export const scrape = async (entryPointUrl: string): Promise<void> => {
  const res = await fetch(entryPointUrl);
  const htmlText = await res.text();
  const dom = new JSDOM(htmlText);

  const reader = new Readability(dom.window.document, {
    charThreshold: 0,
    keepClasses: true,
    nbTopCandidates: 500,
  });

  // Parse the article content
  const parsed = reader.parse();
  if (!parsed) throw Error("Failed to parse");

  const aTagsInContent = new JSDOM(
    parsed.content,
  ).window.document.getElementsByTagName("a");

  const linksInContent = Array.from(aTagsInContent).map((link) => link.href);

  const contentMd = new Turndown().turndown(parsed.content);

  const summary = {
    title: parsed.title,
    url: entryPointUrl,
    twitter: linksInContent.find((link) =>
      link.startsWith("https://twitter.com/"),
    ),
    linksInContent: linksInContent.filter((link) =>
      link.startsWith("https://"),
    ),
    contentMd,
  };

  console.log(summary);
};

await scrape("https://www.toyb0x.me/");
