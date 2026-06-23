export async function onRequest({ request }) {
  const ua = request.headers.get("user-agent") || "";

  // Browser block
  const isBrowser =
    /Chrome|Firefox|Safari|Edg|OPR|Opera|MSIE|Trident/i.test(ua);

  if (isBrowser) {
    return Response.redirect("https://t.me/allonebd", 302);
  }

  const SOURCE =
    "https://cdn-toffee-playlist.pages.dev/ott_navigator.m3u";

  const res = await fetch(SOURCE, {
    headers: {
      "User-Agent": ua,
    },
  });

  return new Response(await res.text(), {
    headers: {
      "Content-Type": "application/x-mpegURL; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
