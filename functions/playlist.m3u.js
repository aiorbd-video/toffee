export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    // শুধু /playlist.m3u allow
    if (url.pathname !== "/playlist.m3u") {
      return new Response("", {
        status: 404,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // browser detect
    const isBrowser =
      /Mozilla|Chrome|Firefox|Safari|Edge|OPR|Trident/i.test(ua);

    if (isBrowser) {
      return Response.redirect("https://t.me/allonebd", 302);
    }

    const res = await fetch(
      "https://cdn-toffee-playlist.pages.dev/ott_navigator.m3u"
    );

    const text = await res.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/x-mpegURL",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  },
};
