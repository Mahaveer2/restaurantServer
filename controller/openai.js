import { Configuration, OpenAIApi } from "openai";
import config from "config";

export const createProduct = async (req, res) => {
  const configuration = new Configuration({
    apiKey: config.get("OPENAI_SECRET"),
  });
  const openai = new OpenAIApi(configuration);
  const { number, theme, ingredients, dish } = req.body;
  const imageSize = `512x512`;
  const textPrompt = `Create a catchy description for the following restauraunt or foods based on the folling details. ingredients: ${ingredients} , theme: ${theme}, dish : ${dish}:`;
  const imagePrompt = `close up view from above of ${dish} with ingredients : ${ingredients} a ${theme} color theme with ${number} of ingredients against studio kitchen table + cinematic shot + up angle + shot with hasselblad + incredibly detailed, sharpen, details + dramatic lighting, + 50mm, 80mm, 100m + lightroom gallery + behance photographys + unsplash --q 2 --ar 3:2 --v 4 --uplight octane render`;
  try {
    const response = await openai.createImage({
      prompt: imagePrompt,
      n: 2,
      size: imageSize,
    });

    const description = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: textPrompt,
      temperature: 0.8,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const imageUrl = response;
    const data = {
      images: imageUrl.data.data,
      description: description.data.choices[0].text,
    };

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }

    res.status(400).json({
      success: false,
      error: "The image could not be generated",
    });
  }
};
