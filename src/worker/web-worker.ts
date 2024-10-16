/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// background.js - Handles requests from the UI, runs the model, then sends back a response
import { pipeline, env, PipelineType } from "@xenova/transformers";

// Skip initial check for local models, since we are not loading any local models.
env.allowLocalModels = false;

// Due to a bug in onnxruntime-web, we must disable multithreading for now.
// See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
env.backends.onnx.wasm.numThreads = 1;

type PipelineModel = ReturnType<typeof pipeline>;

class PipelineSingleton {
  static task = "text-classification" as PipelineType;
  static model = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
  static instance: null | PipelineModel = null;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  static async getInstance(progress_callback: Function | undefined) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  console.log("Web worker received", event);
  // Retrieve the classification pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  const classifier = await PipelineSingleton.getInstance(() => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    // console.log(x);
    // self.postMessage(x);
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const output = await classifier(event.data.text);

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: output,
  });

  return true;
});
