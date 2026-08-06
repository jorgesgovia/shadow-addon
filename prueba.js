import { getEpisodes } from "./scraper.js";

const episodes = await getEpisodes();

console.log(episodes.length);
console.log(episodes[0]);
