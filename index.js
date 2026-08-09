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

const FLASHMAN_DESCRIPTIONS = [
  "Cinco jóvenes que dejaron la Tierra regresan después de 20 años al descubrir que el Imperio Mess la está invadiendo.",
  "Los Flashman deben cumplir su misión de proteger la Tierra cuando Mess crea una criatura para alterar sus genes.",
  "Jin, atormentado por recuerdos de su secuestro, se obsesiona con detener a un cazador alienígena que ha llegado a la Tierra.",
  "Un Guerrero Bestia hace que Dai vea todo al revés, así que Mag decide entrenar especialmente a Green Flash.",
  "Sara y Lou luchan solas en Nagoya contra un Guerrero Bestia que hace que las máquinas cobren vida.",
  "Jin intenta reparar desesperadamente su Flash Hawk mientras las motocicletas se vuelven clave para detener a un Guerrero Bestia.",
  "Ante un Guerrero Bestia capaz de esconderse como un camaleón, Bun idea una estrategia para ayudar al equipo a descubrir a su enemigo.",
  "El plan de Mess para atrapar a los Flashman en otra dimensión se ve alterado por un científico que quiere viajar 20 años al pasado.",
  "Los Flashman ayudan al Dr. Tokimura a completar su máquina del tiempo mientras Nefel intenta apoderarse de su fuente de energía.",
  "El enamoramiento de Dai por una florista lo lleva a una trampa preparada por Ley Nefel.",
  "Un Guerrero Bestia recién creado se encariña con Lou y comienza a verla como su madre.",
  "Ley Wanda atormenta a los Flashman con un aumento repentino de poder y lleva a Jin al límite al revelar un trauma de su pasado.",
  "Mess crea un monstruo capaz de copiar perfectamente la mente y las habilidades de combate de Jin.",
  "Bun intenta hacerse amigo de una chica problemática mientras Nefel prepara una trampa contra los Flashman.",
  "Sir Cowler, líder de los Cazadores Alienígenas, llega a la Tierra para ayudar a Mess a enfrentarse a los Flashman.",
  "Con Flash King fuera de combate, Cowler usa a Zukonda para encoger humanos y recolectar muestras, incluyendo a Sara.",
  "Jin intenta rescatar un autobús lleno de niños de un Guerrero Bestia explosivo cuando aparece un misterioso alienígena.",
  "El pasado y la misión de Ley Baraki son revelados cuando Keflen envía a Cowler para eliminar un error del pasado de Mess.",
  "Baraki es obligado a regresar con Mess y ayudar a detener a los Flashman, aunque intenta darles una última advertencia.",
  "Una niña psíquica salva a Dai de un Guerrero Bestia y hace que él crea que ella es su hermana menor.",
  "Sara es misteriosamente rescatada de un Guerrero Bestia de dos cabezas por un hombre que cree que ella es su hermana.",
  "Los Flashman responden a una señal de auxilio de un ave fénix espacial que se esconde de Mess en la isla Namegawa.",
  "Sara y Lou consiguen el cuerno de un Guerrero Bestia capaz de conceder todos sus deseos.",
  "Las tranquilas vacaciones de verano de Bun se convierten en una pesadilla cuando Cowler crea horrores en la playa.",
  "Jin queda atrapado en un enfrentamiento con Wanda mientras investiga a un Guerrero Bestia cuyo poder aumenta constantemente.",
  "Lou y una madre investigadora intentan descubrir el secreto de un delicioso platillo de calabaza preparado en un restaurante de Mess.",
  "Dai entrena con un boxeador aspirante cuyos fuertes genes llaman la atención de Keflen.",
  "Keflen mejora a Leh Gals con un nuevo poder de fuego para demostrar que su creación todavía es necesaria para Mess.",
  "Los Flashman enfrentan simultáneamente una nueva forma de Wanda, la aparición de su punto débil y un accidente del Dr. Tokimura.",
  "Los Flashman sufren aterradoras ilusiones de su secuestro de hace 20 años causadas por la nueva forma de Nefel.",
  "Los Flashman pierden repentinamente la capacidad de transformarse y recurren al Dr. Tokimura para descubrir la causa.",
  "El intento de Mag por fortalecer los prismas de los Flashman deja al equipo sin poderes cuando estos se rompen durante una batalla.",
  "Jin intenta ayudar a un niño a recuperar la confianza en su padre, un campeón de judo que acaba de perder una pelea.",
  "Bun desaparece después de ser envenenado y arrojado a unos rápidos, donde una mujer solitaria que perdió a su hijo lo encuentra.",
  "Sara y Lou deben trabajar juntas para aprender una pieza de piano que será clave para detener a un Guerrero Bestia.",
  "Un niño cae en una trampa de Mess que promete riquezas para poder comprar un violín para la chica que le gusta.",
  "Un Guerrero Bestia que absorbe fantasmas infantiles provoca otro encuentro entre Dai y la misteriosa niña psíquica.",
  "Cowler usa a su Guerrero Bestia más poderoso para controlar mentalmente a los Flashman y ponerlos contra Jin.",
  "Sara queda atormentada por Nefel, quien utiliza a un Guerrero Bestia para descubrir sus sentimientos sobre ser una chica normal de la Tierra.",
  "Jin es capturado y encerrado en una base de Mess donde mantienen prisioneras a personas para convertirlas en Guerreros Bestia.",
  "Un Guerrero Bestia convierte a Dai nuevamente en niño y los Flashman recurren a Setsuko Tokimura para protegerlo.",
  "Siguiendo una pista sobre su secuestro, Sara investiga datos de ovnis de hace 20 años mientras los Flashman enfrentan a un Guerrero Bestia electrónico.",
  "Cowler se enfrenta finalmente a Keflen y Mess cuando los Cazadores Alienígenas son atacados, mientras Bo Gardan llega para ayudarlo.",
  "Keflen secuestra a los Cazadores Alienígenas restantes para crear un poderoso Guerrero Bestia usando los genes de Ra Deus.",
  "Los Flashman descubren más sobre el peligroso Fenómeno Anti-Flash mientras intentan salvar al Dr. Tokimura de Cowler.",
  "Las terribles consecuencias del Fenómeno Anti-Flash comienzan a aparecer mientras los Flashman siguen buscando a Cowler para salvar al Dr. Tokimura.",
  "Ley Wanda utiliza su mejora Deus para vengarse de Jin, mientras Cowler y Keflen descubren la verdad sobre Ra Deus.",
  "La transformación de Bo Gardan en un Guerrero Bestia Deus obliga a Cowler a lanzar un ataque total contra el propio Ra Deus.",
  "Finalmente se revela la identidad del hijo secuestrado de Tokimura, mientras Keflen enfrenta la furia de un Ra Deus revivido.",
  "¡El tiempo de los Flashman se acaba! ¿Podrán destruir lo que queda de Mess antes de que el Fenómeno Anti-Flash los consuma?"
];

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
background: "https://m.media-amazon.com/images/S/pv-target-images/24310d53e01154750a2822a90586615615186dbbf640315112c7105934bf2411.jpg",
  ...(cinemeta?.logo ? { logo: cinemeta.logo } : {}),
  description: FLASHMAN_METADATA.description,
  ...(cinemeta?.genres ? { genres: cinemeta.genres } : {}),
  ...(cinemeta?.year ? { year: cinemeta.year } : {}),
  ...(cinemeta?.country ? { country: cinemeta.country } : {}),
  ...(cinemeta?.imdbRating ? { imdbRating: cinemeta.imdbRating } : {}),
  ...(cinemeta?.imdb_id ? { imdb_id: cinemeta.imdb_id } : {}),
...(cinemeta?.cast ? { cast: cinemeta.cast } : {}),
trailers: [
  {
    source: "Q_oVf3qpwIk",
    type: "Trailer"
  }
],
trailerStreams: [
  {
    title: "Supernova Flashman",
    ytId: "Q_oVf3qpwIk"
  }
],
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
        overview: FLASHMAN_DESCRIPTIONS[index] || ep.description,
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
