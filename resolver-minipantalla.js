import { chromium } from "playwright";

export async function resolverVideo(urlCapitulo) {
  console.log("🌐 Abriendo Minipantalla con Chromium:");
  console.log(urlCapitulo);

  const browser = await chromium.launch({
    headless: true
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    let videoG = null;
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

    console.log("🚀 Navegando a Minipantalla...");

    await page.goto(urlCapitulo, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    console.log("✅ Minipantalla cargada.");

    await page.waitForTimeout(5000);

    const iframes = await page.locator("iframe").evaluateAll(elements =>
      elements
        .map(el => el.src)
        .filter(Boolean)
    );

    console.log("🖼️ Iframes encontrados:", iframes.length);

    videoG = iframes.find(src =>
      src.includes("blogger.com/video.g")
    );

    if (!videoG) {
      throw new Error("No encontré Blogger video.g usando Chromium");
    }

    console.log("\n🎥 BLOGGER VIDEO.G ENCONTRADO:");
    console.log(videoG);

    console.log("\n🚀 Abriendo Blogger video.g...");

    await page.goto(videoG, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    console.log("✅ Blogger cargado.");

    await page.waitForTimeout(5000);

    try {
      await page.mouse.click(640, 360);
      console.log("▶️ Clic enviado.");
    } catch (error) {
      console.log("⚠️ Error haciendo clic:", error.message);
    }

    console.log("👀 Esperando videoplayback...");

    for (let i = 0; i < 30; i++) {
      if (videoUrl) break;
      await page.waitForTimeout(1000);
    }

    if (!videoUrl) {
      throw new Error("No encontré googlevideo.com/videoplayback");
    }

    return videoUrl;

  } finally {
    await browser.close();
    console.log("🧹 Chromium cerrado.");
  }
}
