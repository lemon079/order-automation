import { ChatOllama } from "@langchain/ollama";

// Initialize Ollama model (gpt-oss:20b-cloud)
// Make sure Ollama is running locally: ollama serve
// And the model is pulled: ollama pull gpt-oss:20b-cloud
export function createModel() {
  return new ChatOllama({
    model: "gpt-oss:20b-cloud",
    temperature: 0.3,
    // Default baseUrl is http://localhost:11434
    // Uncomment below to use a custom Ollama server:
    // baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  });
}
