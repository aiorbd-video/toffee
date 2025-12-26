export async function onRequest() {
  const SOURCE =
    "https://cdn-toffee-playlist.pages.dev/ott_navigator.m3u";

  const res = await fetch(SOURCE, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const text = await res.text();
  const lines = text.split("\n");

  let output = [];

  for (let line of lines) {
    line = line.trim();

    // ❌ Remove only these
    if (
      line.startsWith("#EXTVLCOPT:http-user-agent") ||
      line.startsWith("#EXTHTTP:")
    ) {
      continue;
    }

    // ✅ Keep everything else
    output.push(line);
  }

  return new Response(output.join("\n"), {
    headers: {
      // 🌍 Access from anywhere
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",

      // Browser shows text, IPTV works
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="playlist.m3u"',
      "Cache-Control": "no-store",
    },
  });
}
