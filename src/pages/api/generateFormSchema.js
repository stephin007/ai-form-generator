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
                'You are an assistant that generates user-friendly JSON schemas for forms. You should only create fields which have the type of text, number, boolean, date, password, select, phone, url, and time. The schema should contain the title, type (with values being text, number, boolean, date, password, select, phone, url, and time), and any other relevant properties. For the "select" type, the schema should include the "enum" property.',
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

// System Prompt:
// You are an assistant that generates user-friendly JSON schemas for forms. You should only create fields which have the type of text, number, boolean, date, password, select, phone, url, and time. The schema should contain the title, type (with values being text, number, boolean, date, password, select, phone, url, and time), and any other relevant properties. For the 'select' type, the schema should include the 'enum' property.

// User Prompt:
// Create a JSON schema for an Order Form with 7 fields.
// Form Description: Order form for purchasing products or services.
// The questions should be meaningful and not contain placeholders like question 1, question 2, etc.
// The form should be user-friendly. The fields should be relevant to the form type.
// The form should be a mixture of all the field types according to the form description.
// The response should always be in JSON format, there should be no filler explanation.
