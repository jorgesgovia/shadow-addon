import sdk from "stremio-addon-sdk";
import { createServer } from "node:http";
const { addonBuilder, serveHTTP } = sdk;

const FLASHMAN_METADATA = {
  poster: "https://image.tmdb.org/t/p/w500/mKoZUWBPMRa7sFBWMPuusTBBmS1.jpg",
  background: "https://image.tmdb.org/t/p/original/69ZOUqhfdSV8Ff3u7iz4P3NlETG.jpg",
  description: "In 1966, five infant children were kidnapped by an alien group known as the Alien Hunters for the Reconstructive Experiment Empire Mess, who wanted samples of humans from Earth to experiment on. The children were rescued by Mess' arch enemy, the Flash alien race, which took each one to a different planet of the Flash solar system for training. Each child was trained separately in a range of superpowers that will allow them to fight Mess, their bodies also adapted to the atmosphere of the Flash Solar System making them gain special abilities. When they finally return to Earth in 1986 to combat Mess, who is now trying to invade it, they use the opportunity to search for their birth parents.",
  genres: ["Action", "Adventure", "Science Fiction"],
  year: 1986,
  country: ["JP"],
  language: "ja"
};

import { getEpisodes } from "./scraper.js";
import { resolverVideo } from "./resolver-minipantalla.js";

const builder = new addonBuilder({
  id: "org.shadowrangers.addon",
  version: "1.0.0",
name: "Super Sentai Addon",
description: "Series y capítulos de Super Sentai para Stremio",

  resources: [
  "catalog",
  {
    name: "meta",
    types: ["series"],
    idPrefixes: ["shadowrangers-"]
  },
  "stream"
],

types: [
  "series"
],

  catalogs: [
    {
      type: "series",
      id: "shadowrangers-series",
      name: "Super Sentai"
    }
  ]
});


builder.defineCatalogHandler(() => {
  return Promise.resolve({
    metas: [
      {
        id: "shadowrangers-flashman",
        type: "series",
        name: "Choushinsei Flashman",
        ...FLASHMAN_METADATA
      }
    ]
  });
});


builder.defineMetaHandler(async ({ id }) => {

 console.log("META PEDIDA:", id);

  const episodes = await getEpisodes();
console.log("PRIMER EPISODIO:", JSON.stringify(episodes[0], null, 2));

console.log("META ENVIADA:", JSON.stringify({
  id: "shadowrangers-flashman",
  videos: episodes.length
}));

  return {
  meta: {
    id: "shadowrangers-flashman",
  type: "series",
  name: "Choushinsei Flashman",
  ...FLASHMAN_METADATA,
videos: episodes.map((ep, index) => ({
  id: `flashman-${index + 1}`,
  title: ep.title,
  season: 1,
  episode: index + 1,
  released: new Date(ep.date).toISOString(),
  thumbnail: ep.thumbnail,
overview: ep.description,
  runtime: ep.runtime
}))    

  }
};
});

builder.defineStreamHandler(async ({ id }) => {
  console.log("STREAM PEDIDO:", id);

  const number = id.match(/flashman-(\d+)/);

  if (!number) {
    return { streams: [] };
  }

  const episodes = await getEpisodes();
  const episode = episodes[Number(number[1]) - 1];

  if (!episode) {
    return { streams: [] };
  }

  console.log("EPISODIO SELECCIONADO:", episode.title);

  return {
    streams: [
      {
        title: episode.title,
        url: `http://127.0.0.1:7071/play/${number[1]}`,
        behaviorHints: {
          notWebReady: true
        }
      }
    ]
  };
});

serveHTTP(builder.getInterface(), {
  port: 7070
});

const playServer = createServer(async (req, res) => {
  const match = req.url.match(/^\/play\/(\d+)$/);

  if (!match) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  try {
    const episodes = await getEpisodes();
    const episode = episodes[Number(match[1]) - 1];

    if (!episode) {
      res.writeHead(404);
      res.end("Episode not found");
      return;
    }

    console.log("▶️ PLAY SOLICITADO:", episode.title);

    const videoUrl = await resolverVideo(episode.link);

    console.log("🎥 VIDEO RESUELTO:", videoUrl);

    if (!videoUrl) {
      res.writeHead(500);
      res.end("No se pudo resolver el video");
      return;
    }

    res.writeHead(302, {
      Location: videoUrl
    });

    res.end();

  } catch (error) {
    console.error("❌ ERROR AL REPRODUCIR:", error);

    res.writeHead(500);
    res.end("Error resolviendo video");
  }
});

playServer.listen(7071, () => {
  console.log("▶️ Play server activo en http://127.0.0.1:7071");
});
