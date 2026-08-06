import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { getEpisodes } from "./scraper.js";

const port = 7070;

const manifest = JSON.parse(
  readFileSync("./manifest.json", "utf8")
);

const server = createServer(async (req, res) => {

console.log("PETICIÓN:", req.url);
  if (req.url === "/manifest.json") {

res.writeHead(200, {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
});

    res.end(JSON.stringify(manifest));
    return;
  }

if (req.url.startsWith("/catalog/series/shadowrangers-series.json")) {

    const catalog = {
      metas: [
        {
          id: "choushinsei-flashman",
          type: "series",
          name: "Choushinsei Flashman",
          poster: ""
        }
      ]
    };

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(catalog));
    return;
  }

  if (req.url.startsWith("/meta/series/")) {

    const episodes = await getEpisodes();

    const meta = {
      id: "choushinsei-flashman",
      type: "series",
      name: "Choushinsei Flashman",
      description: "Serie Super Sentai Flashman",
      videos: episodes.map((ep, index) => ({
        id: `flashman-${index + 1}`,
        title: ep.title,
        released: ep.date
      }))
    };

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(meta));
    return;
  }

if (req.url.startsWith("/stream/series/")) {

    const episodeNumber = req.url.match(/flashman-(\d+)/);

    if (!episodeNumber) {
      res.writeHead(400);
      res.end("Episode not found");
      return;
    }

    const episodes = await getEpisodes();

    const episode = episodes[Number(episodeNumber[1]) - 1];

    if (!episode) {
      res.writeHead(404);
      res.end("Episode not found");
      return;
    }

    const response = await fetch(episode.link);
    const html = await response.text();

    const voe = html.match(/https:\/\/voe\.sx\/e\/[^'"]+/);

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      streams: [
        {
          title: episode.title,
          url: voe[0]
        }
      ]
    }));

    return;
  }

  res.writeHead(404);
  res.end("Not found");

});


server.listen(port, () => {
  console.log(`Addon iniciado en puerto ${port}`);
});
