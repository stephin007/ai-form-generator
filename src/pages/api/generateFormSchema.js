// pages/api/generateFormSchema.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { prompt } = req.body;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                'You are an assistant that generates user-friendly JSON schemas for forms. You should only create fields which have the type of text, number, boolean, date, password, select, phone, url, and time. The schema should contain the title, type, format, and any other relevant properties. for select format type, the schema should have format as "select"',
            },
            { role: "user", content: prompt },
          ],
          temperature: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
