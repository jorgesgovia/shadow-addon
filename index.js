import sdk from "stremio-addon-sdk";
import { createServer } from "node:http";
const { addonBuilder, serveHTTP } = sdk;

const FLASHMAN_METADATA = {
  poster: "https://image.tmdb.org/t/p/w500/mKoZUWBPMRa7sFBWMPuusTBBmS1.jpg",
  background: "https://image.tmdb.org/t/p/original/69ZOUqhfdSV8Ff3u7iz4P3NlETG.jpg",
description: "En 1986, cinco jóvenes con poderes especiales regresan a la Tierra como Supernova Flashman para combatir al imperio Mess y descubrir sus verdaderos orígenes.",  genres: ["Action", "Adventure", "Science Fiction"],
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


builder.defineCatalogHandler(async () => {
  const cinemeta = await obtenerMetadataCinemeta();

  return {
    metas: [
      {
        id: "shadowrangers-flashman",
        type: "series",
        name: cinemeta?.name || "Choushinsei Flashman",
        poster: cinemeta?.poster,
        background: cinemeta?.background,
        logo: cinemeta?.logo,
        description: cinemeta?.description,
        genres: cinemeta?.genres,
        releaseInfo: cinemeta?.releaseInfo || cinemeta?.year,
        country: cinemeta?.country,
        imdbRating: cinemeta?.imdbRating,
        imdb_id: cinemeta?.imdb_id,
        runtime: cinemeta?.runtime,
        cast: cinemeta?.cast
      }
    ]
  };
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
  description: FLASHMAN_METADATA.description,
  ...(cinemeta?.genres ? { genres: cinemeta.genres } : {}),
  ...(cinemeta?.year ? { year: cinemeta.year } : {}),
  ...(cinemeta?.country ? { country: cinemeta.country } : {}),
  ...(cinemeta?.imdbRating ? { imdbRating: cinemeta.imdbRating } : {}),
  ...(cinemeta?.imdb_id ? { imdb_id: cinemeta.imdb_id } : {}),
...(cinemeta?.cast ? { cast: cinemeta.cast } : {}),
...(cinemeta?.runtime ? { runtime: cinemeta.runtime } : {}),
...(cinemeta?.releaseInfo ? { releaseInfo: cinemeta.releaseInfo } : {}),
...(cinemeta?.released ? { released: cinemeta.released } : {}),
...(cinemeta?.status ? { status: cinemeta.status } : {}),
...(cinemeta?.tvdb_id ? { tvdb_id: cinemeta.tvdb_id } : {}),
...(cinemeta?.moviedb_id ? { moviedb_id: cinemeta.moviedb_id } : {}),
...(cinemeta?.popularities ? { popularities: cinemeta.popularities } : {}),
...(cinemeta?.popularity ? { popularity: cinemeta.popularity } : {}),
...(cinemeta?.genre ? { genre: cinemeta.genre } : {}),
...(cinemeta?.director?.length ? { director: cinemeta.director } : {}),
...(cinemeta?.writer?.length ? { writer: cinemeta.writer } : {}),
...(cinemeta?.awards ? { awards: cinemeta.awards } : {}),
...(cinemeta?.trailers?.length ? { trailers: cinemeta.trailers } : {}),
...(cinemeta?.trailerStreams?.length ? { trailerStreams: cinemeta.trailerStreams } : {}),
...(cinemeta?.links?.length ? { links: cinemeta.links } : {}),
...(cinemeta?.behaviorHints ? { behaviorHints: cinemeta.behaviorHints } : {})
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
