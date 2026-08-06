const url = "https://shadowrangers.live/capitulos/choushinsei-flashman-1x1/";

const response = await fetch(url);
const html = await response.text();

for (const palabra of ["dooplay", "player", "postid", "id", "trailer"]) {
  console.log("BUSCANDO:", palabra);
  console.log(html.match(new RegExp(".{0,80}" + palabra + ".{0,80}", "gi")));
}
