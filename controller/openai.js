import { Configuration, OpenAIApi } from "openai";
import config from "config";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET,
});
const openai = new OpenAIApi(configuration);

export const createProduct = async (req, res) => {
  const { number, theme, ingredients, dish } = req.body;
  const imageSize = `512x512`;
  const textPrompt = `Create a catchy description for the following restauraunt or foods based on the folling details. ingredients: ${ingredients} , theme: ${theme}, dish : ${dish}`;
  const imagePrompt = `A top view of ${dish} image with a ${theme} theme.`;

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
