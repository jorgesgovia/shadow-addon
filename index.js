import sdk from "stremio-addon-sdk";
const { addonBuilder, serveHTTP } = sdk;

import { getEpisodes } from "./scraper.js";

const builder = new addonBuilder({
  id: "org.shadowrangers.addon",
  version: "1.0.0",
  name: "ShadowRangers Addon",
  description: "Series y capítulos de ShadowRangers para Stremio",

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
      name: "ShadowRangers"
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
        poster: "https://image.tmdb.org/t/p/w500/mKoZUWBPMRa7sFBWMPuusTBBmS1.jpg"
      }
    ]
  });
});


builder.defineMetaHandler(async ({ id }) => {

  console.log("META PEDIDA:", id);

  const episodes = await getEpisodes();

console.log("META ENVIADA:", JSON.stringify({
  id: "shadowrangers-flashman",
  videos: episodes.length
}));

  return {
  meta: {
    id: "shadowrangers-flashman",
    type: "series",
    name: "Choushinsei Flashman",
    videos: episodes.map((ep, index) => ({
      id: `flashman-${index + 1}`,
      title: ep.title,
      season: 1,
      episode: index + 1
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

  const response = await fetch(episode.link);
  const html = await response.text();

  const voe = html.match(/https:\/\/voe\.sx\/e\/[^"'\s<]+/);

  console.log("VOE ENCONTRADO:", voe ? voe[0] : "NO ENCONTRADO");

  if (!voe) {
    return { streams: [] };
  }

  return {
    streams: [
      {
        title: episode.title,
        url: voe[0]
      }
    ]
  };
});


serveHTTP(builder.getInterface(), {
  port: 7070
});
