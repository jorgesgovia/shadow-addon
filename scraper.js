import * as cheerio from "cheerio";

const SHADOW_URL =
  "https://shadowrangers.live/series/choushinsei-flashman/";


const MINIPANTALLA_BASE =
  "https://minipantalla.blogspot.com/2013/11/";

export async function getEpisodes() {
  console.log("🌐 Obteniendo episodios de ShadowRangers...");
  
  const response = await fetch(SHADOW_URL);
  const html = await response.text();
  
  const $ = cheerio.load(html);
  const episodes = [];
  
  $("li[class^='mark-']").each((i, el) => {
    const title = $(el).find(".episodiotitle a").text().trim();
    const date = $(el).find(".date").text().trim();
    
    if (!title) return;
    
    const episodeNumber = i + 1;
    
    let slug;
    
    if (episodeNumber === 1) {
      slug = "flashman-capitulo-1.html";
    } else if (episodeNumber === 2) {
      slug = "flasman-capitulo-2_6.html";
    } else if (episodeNumber === 10) {
      slug = "flahman-capitulo-10-la-trampa-de-la.html";
    } else if (episodeNumber === 32) {  
      slug = "flasman-capitulo-32.html";
    } else if (episodeNumber === 50) {
      slug = "flashman-capitulo-50-final.html";
    } else {
      slug = `flashman-capitulo-${episodeNumber}.html`;
    }
    
    episodes.push({
  title,
  date,
  link: `${MINIPANTALLA_BASE}${slug}`,
  thumbnail: null
});  
  });

const TMDB_API_KEY = "0c9b59bfcaa914850d8a7e5bfd0c7f3d";

try {
console.log("🖼️ Obteniendo miniaturas desde TMDB...");

const searchResponse = await fetch(
`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=Choushinsei%20Flashman`
);

const searchData = await searchResponse.json();
const tmdbSeries = searchData.results?.[0];

if (!tmdbSeries) {
console.log("⚠️ No se encontró Choushinsei Flashman en TMDB.");
} else {
const seasonResponse = await fetch(
`https://api.themoviedb.org/3/tv/${tmdbSeries.id}/season/1?api_key=${TMDB_API_KEY}`
);


const seasonData = await seasonResponse.json();

for (const episode of episodes) {
  const tmdbEpisode = seasonData.episodes?.find(
    ep => ep.episode_number === episodes.indexOf(episode) + 1
  );

  if (tmdbEpisode?.still_path) {
  episode.thumbnail = "https://image.tmdb.org/t/p/w500" + tmdbEpisode.still_path;
} else {
  episode.thumbnail = null;
}
episode.description = tmdbEpisode?.overview || null;
episode.runtime = tmdbEpisode?.runtime || null;
}

console.log("🖼️ Miniaturas TMDB obtenidas.");


}
} catch (error) {
console.log("⚠️ Error obteniendo miniaturas de TMDB:", error.message);

for (const episode of episodes) {
episode.thumbnail = null;
}
}

  
  console.log(`📺 Episodios encontrados: ${episodes.length}`);
  
  return episodes;
}
