import { OpenAI } from "openai";
import { OpenAI_KEY } from "./constant";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",  // Use OpenRouter's API base URL
  apiKey: OpenAI_KEY, // Replace with your actual key
  dangerouslyAllowBrowser: true
});

export default openai;
