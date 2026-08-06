import * as cheerio from "cheerio";

export async function getEpisodes() {
  const url = "https://shadowrangers.live/series/choushinsei-flashman/";

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const episodes = [];

  $("li[class^='mark-']").each((i, el) => {
    const title = $(el).find(".episodiotitle a").text().trim();
    const link = $(el).find(".episodiotitle a").attr("href");
    const date = $(el).find(".date").text().trim();

    episodes.push({
      title,
      link,
      date
    });
  });

  return episodes;
}
