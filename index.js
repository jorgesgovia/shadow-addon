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
import { resolverDrive } from "./resolver-drive.js";
const CINEMETA_URL =
  "https://v3-cinemeta.strem.io/meta/series/tt0090407.json";

async function obtenerMetadataCinemeta() {
  try {
    const response = await fetch(CINEMETA_URL);

    if (!response.ok) {
      console.log("⚠️ Cinemeta respondió:", response.status);
      return null;
    }

    const data = await response.json();
    return data.meta || null;
  } catch (error) {
    console.log("⚠️ Error consultando Cinemeta:", error.message);
    return null;
  }
}


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

  const cinemeta = await obtenerMetadataCinemeta();

  if (cinemeta) {
    console.log("✅ Metadata obtenida de Cinemeta");
    console.log("⭐ IMDb:", cinemeta.imdbRating);
    console.log("🏷️ Logo:", cinemeta.logo);
  } else {
    console.log("⚠️ Cinemeta no disponible; usando metadata local");
  }

  const metaBase = {
  id: "shadowrangers-flashman",
  type: "series",
  name: cinemeta?.name || "Choushinsei Flashman",
  ...FLASHMAN_METADATA,
  ...(cinemeta?.poster ? { poster: cinemeta.poster } : {}),
  ...(cinemeta?.background ? { background: cinemeta.background } : {}),
  ...(cinemeta?.logo ? { logo: cinemeta.logo } : {}),
  ...(cinemeta?.description ? { description: cinemeta.description } : {}),
  ...(cinemeta?.genres ? { genres: cinemeta.genres } : {}),
  ...(cinemeta?.year ? { year: cinemeta.year } : {}),
  ...(cinemeta?.country ? { country: cinemeta.country } : {}),
  ...(cinemeta?.imdbRating ? { imdbRating: cinemeta.imdbRating } : {}),
  ...(cinemeta?.imdb_id ? { imdb_id: cinemeta.imdb_id } : {})
};

console.log("META ENVIADA:", JSON.stringify({
    id: metaBase.id,
    name: metaBase.name,
    logo: metaBase.logo,
    imdbRating: metaBase.imdbRating,
    videos: episodes.length
  }));

  return {
    meta: {
      ...metaBase,

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
  
const videoUrl = await resolverDrive(Number(number[1]));
  
console.log("VIDEO RESUELTO:", videoUrl);
  
if (!videoUrl) {
  return { streams: [] };
}  
    
return {
  streams: [
    {
      title: episode.title,
      url: videoUrl,
      behaviorHints: {
        notWebReady: true,
        poster: "https://image.tmdb.org/t/p/original/7jASxo9DcEkuhCQhuJpgkmjoTgt.png"
      }
    }
  ]
};
    
});
      
serveHTTP(builder.getInterface(), {
  port: process.env.PORT || 7070,
  host: "0.0.0.0"
});
