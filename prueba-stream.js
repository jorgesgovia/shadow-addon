const url = "http://localhost:7070/stream/series/choushinsei-flashman:flashman-1";

const response = await fetch(url);
const data = await response.text();

console.log(data);
