export async function onRequest({ request }) {
  const ua = request.headers.get("user-agent") || "";

  // ❌ Block all browsers
  const isBrowser =
    /Chrome|Firefox|Safari|Edg|OPR|MSIE/i.test(ua);

  // ✅ Allow only IPTV / Media players
  const isIPTV =
    /IPTV|VLC|OTT|ExoPlayer|TiviMate|PerfectPlayer|Kodi/i.test(ua);

  // 🚫 Browser access blocked
  if (isBrowser || !isIPTV) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "https://t.me/allonebd",
      },
    });
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
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="playlist.m3u"',
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
