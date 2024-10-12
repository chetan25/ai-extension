export type Model = {
  task: string;
  model: string;
  description: string;
};

export const AVAILABLE_MODELS: Model[] = [
  {
    task: "text-classification",
    model: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    description: "Useful for text classification or sentiment analysis.",
  },
  {
    task: "question-answering",
    model: "Xenova/distilbert-base-uncased-distilled-squad",
    description: "Retrieve the answer to a question from a given text.",
  },
  {
    task: "summarization",
    model: "Xenova/distilbart-cnn-6-6",
    description:
      "Producing a shorter version of a document while preserving its important information.",
  },
];
