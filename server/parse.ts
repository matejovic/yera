import jsdom from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";

const { JSDOM } = jsdom;
const turndownService = new TurndownService();

export async function parseArticle(url: string): Promise<{ content: string, title: string }> {
  const dom = await JSDOM.fromURL(url, {});
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article) throw new Error("Could not parse article");
  return { content: turndownService.turndown(article.content), title: article.title };
}