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
    "meta",
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

  return Promise.resolve({

      id: "shadowrangers-flashman",
      type: "series",
      name: "Choushinsei Flashman",
      description: "Serie Super Sentai Flashman",

      videos: episodes.map((ep, index) => ({
        id: `flashman-${index + 1}`,
        title: ep.title,
season: 1,
episode: index + 1,
        released: ep.date
      }))
    
  });
});


builder.defineStreamHandler(async ({ id }) => {

console.log(STREAM PEDIDO:", id);

  const number = id.match(/flashman-(\d+)/);

  const episodes = await getEpisodes();

  const episode = episodes[Number(number[1]) - 1];

  return Promise.resolve({
    streams: [
      {
        title: episode.title,
        url: episode.link
      }
    ]
  });
});


serveHTTP(builder.getInterface(), {
  port: 7070
});
