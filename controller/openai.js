import { Configuration, OpenAIApi } from "openai";
import config from "config";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET,
});
const openai = new OpenAIApi(configuration);

export const createProduct = async (req, res) => {
  const {  theme, dish } = req.body;
  const imageSize = `1024x1024`;
  const textPrompt = `Create a catchy description for the following restauraunt or foods based on the folling details. ingredients: ${ingredients} , theme: ${theme}, dish : ${dish}`;
  const imagePrompt = `Create a stunning and professional top view image of the dish ${dish} that showcases its flavors and ingredients in a visually striking way, fitting the theme of ${theme}. Incorporate any relevant setting or props that highlight the dish's unique qualities, and use your creative license to capture the essence of the dish in your own style. Let your imagination and DALL-E's artistic`;

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
