const DRIVE_FOLDER =
  'https://drive.google.com/drive/mobile/folders/1PXkjbU32tpllgv6K-z-tbZuUyjDZ6zS6?usp=share_link';

async function obtenerArchivosDrive() {
  const html = await fetch(DRIVE_FOLDER).then(r => r.text());

  const regex =
    /\\x22([a-zA-Z0-9_-]{20,})\\x22,\\x5b\\x22[^\]]*?\\x22\\x5d,\\x22(Chōshinsei Flashman E(\d+)[^"]*?\.mp4)\\x22/g;

  const episodios = [];

  for (const match of html.matchAll(regex)) {
    episodios.push({
      id: match[1],
      nombre: match[2],
      episodio: Number(match[3])
    });
  }

  return episodios
    .filter((e, i, arr) =>
      arr.findIndex(x => x.episodio === e.episodio) === i
    )
    .sort((a, b) => a.episodio - b.episodio);
}

export async function resolverDrive(numeroEpisodio) {

  console.log(`🔎 Buscando E${numeroEpisodio} en Google Drive...`);

  const episodios = await obtenerArchivosDrive();

  const episodio = episodios.find(
    e => e.episodio === Number(numeroEpisodio)
  );

  if (!episodio) {
    throw new Error(`No encontré el episodio E${numeroEpisodio}`);
  }

  const videoUrl =
    `https://drive.usercontent.google.com/download?id=${episodio.id}&export=download&confirm=t`;

  console.log('🎬 Episodio:', episodio.nombre);
  console.log('🆔 ID:', episodio.id);
  console.log('🎥 Video:', videoUrl);

  return videoUrl;
}
