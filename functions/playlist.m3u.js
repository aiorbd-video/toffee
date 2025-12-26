export async function onRequest() {
  const SOURCE =
    "https://cdn-toffee-playlist.pages.dev/ott_navigator.m3u";

  const res = await fetch(SOURCE);
  const text = await res.text();

  const lines = text.split("\n");

  let output = ["#EXTM3U"];
  let lastExtinf = null;

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith("#EXTINF")) {
      const name = line.match(/tvg-name="([^"]*)"/)?.[1] || "";
      const logo = line.match(/tvg-logo="([^"]*)"/)?.[1] || "";
      const title = line.split(",").pop();

      lastExtinf =
        `#EXTINF:-1 tvg-name="${name}" tvg-logo="${logo}",${title}`;
    } 
    else if (lastExtinf && line.endsWith(".m3u8")) {
      output.push(lastExtinf);
      output.push(line);
      lastExtinf = null;
    }
  }

  return new Response(output.join("\n"), {
    headers: {
      "Content-Type": "application/x-mpegURL",
      "Cache-Control": "no-store",
    },
  });
}
