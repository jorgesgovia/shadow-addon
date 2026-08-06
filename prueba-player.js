const url = "https://shadowrangers.live/capitulos/choushinsei-flashman-1x50/";

const response = await fetch(url);
const html = await response.text();

const voe = html.match(/https:\/\/voe\.sx\/e\/[^'"]+/);

console.log(voe[0]);
