export async function onRequest({ request }) {
  const ua = request.headers.get("user-agent") || "";

  // ✅ Allowed native apps only
  const isAllowedApp =
    /Android|Windows|OTT|IPTV|VLC|ExoPlayer/i.test(ua);

  // ❌ Browser or unknown access
  if (!isAllowedApp) {
    return Response.redirect("https://t.me/allonebd", 302);
  }

  const SOURCE =
    "https://cdn-toffee-playlist.pages.dev/ott_navigator.m3u";

  const res = await fetch(SOURCE, {
    headers: {
      "User-Agent": ua,
    },
  });

  const text = await res.text();

  return new Response(text, {
    headers: {
      // ✅ CORS only for allowed apps
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",

      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="playlist.m3u"',
      "Cache-Control": "no-store",
    },
  });
}
