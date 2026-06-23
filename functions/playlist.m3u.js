export async function onRequest({ request }) {
  const ua = request.headers.get("user-agent") || "";

  // ১. ব্রাউজার শনাক্ত করার জন্য একটি শক্তিশালী রেজেক্স (Regex)
  // এটি প্রায় সব জনপ্রিয় ব্রাউজারকে ডিটেক্ট করবে
  const isBrowser = /Mozilla|AppleWebKit|Chrome|Safari|Edg|OPR|MSIE|Firefox/i.test(ua);

  // ২. যদি ব্রাউজার হয়, তবে টেলিগ্রামে রিডাইরেক্ট করুন
  if (isBrowser) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "https://t.me/allonebd",
      },
    });
  }

  // ৩. যদি ব্রাউজার না হয় (অর্থাৎ আইপিটিভি প্লেয়ার), তবে ফাইলটি সার্ভ করুন
  const SOURCE = "https://raw.githubusercontent.com/BINOD-XD/Toffee-Auto-Update-Playlist/refs/heads/main/toffee_OTT_Navigator.m3u";
  
  const res = await fetch(SOURCE);
  const text = await res.text();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="playlist.m3u"',
      "Access-Control-Allow-Origin": "*", // CORS পারমিশন
    },
  });
}
