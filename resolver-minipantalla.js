import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function resolverVideo(urlCapitulo) {
  console.log("🌐 Abriendo Minipantalla:");
  console.log(urlCapitulo);

  // 1. Obtener la página del capítulo
  const response = await fetch(urlCapitulo);
  const html = await response.text();

  console.log("✅ HTML recibido:", html.length, "caracteres");

  // 2. Buscar el iframe de Blogger video.g
  const $ = cheerio.load(html);

  let videoG = null;

  $("iframe").each((i, el) => {
    const src = $(el).attr("src");

    if (src && src.includes("blogger.com/video.g")) {
      videoG = src;
    }
  });

  if (!videoG) {
    throw new Error("No encontré Blogger video.g en Minipantalla");
  }

  console.log("\n🎥 BLOGGER VIDEO.G ENCONTRADO:");
  console.log(videoG);

// 3. Abrir Blogger con Playwright
console.log("\n🚀 Abriendo Blogger video.g...");

const browser = await chromium.launch({
  headless: false
});

const context = await browser.newContext();
const page = await context.newPage();

let videoUrl = null;
  page.on("request", request => {
    const requestUrl = request.url();

    if (
      !videoUrl &&
      requestUrl.includes("googlevideo.com") &&
      requestUrl.includes("videoplayback")
    ) {
      videoUrl = requestUrl;

      console.log("\n🎥🎥🎥 GOOGLEVIDEO ENCONTRADO 🎥🎥🎥");
      console.log(videoUrl);
    }
  });

  await page.goto(videoG, {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });

  console.log("✅ Blogger cargado.");

  await page.waitForTimeout(3000);

  // Intentar iniciar el reproductor
  try {
    await page.mouse.click(640, 360);
    console.log("▶️ Clic enviado.");
  } catch (error) {
    console.log("⚠️ Error haciendo clic:", error.message);
  }

  console.log("👀 Esperando videoplayback...");

  // Esperar hasta 30 segundos
  for (let i = 0; i < 30; i++) {
    if (videoUrl) break;

    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(10000);

  if (!videoUrl) {
    throw new Error("No encontré googlevideo.com/videoplayback");
  }

  return videoUrl;
}
