export async function onRequest({ request }) {
  // The source URL for the M3U playlist
  const SOURCE = "https://cdn-toffee-playlist.pages.dev/ott_navigator.m3u";

  // Fetch the playlist from the source
  const res = await fetch(SOURCE);

  // Get the content
  const text = await res.text();

  // Return the response with wide-open CORS headers
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="playlist.m3u"',
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*", // Allows any origin to access this resource
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS", // Explicitly allow GET/OPTIONS
      "Access-Control-Allow-Headers": "*", // Allows all headers
    },
  });
}
