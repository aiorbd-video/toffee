export async function handler(event, context) {
  const urlObj = new URL(event.rawUrl);
  const target = urlObj.searchParams.get("url");

  if (!target) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Missing ?url parameter"
    };
  }

  const cookie =
    "Edge-Cache-Cookie=URLPrefix=aHR0cHM6Ly9tcHJvZC1jZG4udG9mZmVlbGl2ZS5jb20:Expires=1765073772:KeyName=prod_live_events:Signature=4XcBJhueYVTuBZzmMvqitO5P57gvTP6VwZO--H75AaXFllB2s6j_mtJ0x2RVPYaGgaVzO0t7Fbzn2nSR78zZDg";

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent":
          "Toffee (Linux;Android 14) AndroidXMedia3/1.1.1/64103898/4d2ec9b8c7534adc",
        Referer: "https://toffeelive.com/",
        Origin: "https://toffeelive.com/",
        Cookie: cookie
      }
    });

    const contentType = response.headers.get("content-type") || "";
    const isPlaylist =
      target.endsWith(".m3u8") ||
      contentType.includes("application/vnd.apple.mpegurl");

    /* ==========================================
        🔥 M3U8 PLAYLIST REWRITER
    =========================================== */
    if (isPlaylist) {
      let body = await response.text();
      const base = target.substring(0, target.lastIndexOf("/") + 1);
      const proxyOrigin = urlObj.origin;

      body = body
        .split("\n")
        .map((line) => {
          line = line.trim();

          if (line.startsWith("#")) {
            if (line.startsWith("#EXT-X-KEY") && line.includes('URI="')) {
              return line.replace(/URI="(.*?)"/, (m, p1) => {
                const resolved = p1.startsWith("http")
                  ? p1
                  : new URL(p1, base).toString();
                return `URI="${proxyOrigin}/.netlify/functions/proxy?url=${encodeURIComponent(
                  resolved
                )}"`;
              });
            }
            return line;
          }

          if (!line) return "";

          const resolved = line.startsWith("http")
            ? line
            : new URL(line, base).toString();

          return `${proxyOrigin}/.netlify/functions/proxy?url=${encodeURIComponent(
            resolved
          )}`;
        })
        .join("\n");

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*"
        },
        body
      };
    }

    /* ==========================================
        🔥 NORMAL FILES (TS, MP4, JPG, PNG etc.)
    =========================================== */
    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": target.endsWith(".ts")
          ? "video/mp2t"
          : contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS"
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Proxy error: " + err.message
    };
  }
}
