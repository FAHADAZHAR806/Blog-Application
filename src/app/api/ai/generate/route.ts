import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY; // Make sure to add this in .env

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a professional blog writer. 
                        Respond ONLY with a JSON object:
                        {"title": "...", "content": "html content", "query": "one specific keyword for a professional cinematic photo"}
                        No markdown backticks.`,
            },
            { role: "user", content: `Write a blog about: ${prompt}` },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    const result = await response.json();
    const data = JSON.parse(result.choices[0].message.content);

    // ✅ Better Approach: Use Unsplash Search API for accuracy
    let imageUrl =
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643"; // Fallback

    const searchQuery = data.query || prompt;

    try {
      const imgRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashKey}`,
          },
        },
      );
      const imgData = await imgRes.json();
      if (imgData.results && imgData.results.length > 0) {
        imageUrl = imgData.results[0].urls.regular;
      }
    } catch (imgError) {
      console.error("Image fetch failed, using fallback");
    }

    return NextResponse.json({
      success: true,
      data: {
        title: data.title,
        content: data.content,
        image: imageUrl, // Accurate image according to title
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
