// background.js - Handles requests from the UI, runs the model, then sends back a response
import { pipeline, env, PipelineType } from "@xenova/transformers";
import { AVAILABLE_MODELS } from "../utils/data";
import { getInnerHTMLFromPage } from "../utils/utils";

if (
  typeof ServiceWorkerGlobalScope !== "undefined" &&
  self instanceof ServiceWorkerGlobalScope
) {
  // Skip initial check for local models, since we are not loading any local models.
  env.allowLocalModels = false;

  // Due to a bug in onnxruntime-web, we must disable multithreading for now.
  // See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
  env.backends.onnx.wasm.numThreads = 1;

  class PipelineSingleton {
    // static task = "text-classification";
    // static model = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
    static instance = {
      "text-classification": null,
      "question-answering": null,
      summarization: null,
    };

    static async getInstance(task, progress_callback) {
      if (this.instance[task] === null) {
        console.log("create new Instance", task);
        const item = AVAILABLE_MODELS.find((el) => el.task == task);
        const model = item.model;
        this.instance[task] = pipeline(task, model, {
          progress_callback,
        });
      }

      return this.instance[task];
    }
  }

  // Listen for messages from the UI, process it, and send the result back.
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Run model prediction asynchronously
    (async function () {
      console.log({ message });

      if (message.type == "add") {
        await PipelineSingleton.getInstance(message.task, (data) => {
          // You can track the progress of the pipeline creation here.
          // e.g., you can send `data` back to the UI to indicate a progress bar
          console.log("progress", data);
        });
        sendResponse("Model Loaded");
      } else if (message.type == "predict") {
        const model = await PipelineSingleton.getInstance(
          message.task,
          (data) => {
            // You can track the progress of the pipeline creation here.
            // e.g., you can send `data` back to the UI to indicate a progress bar
            console.log("progress", data);
          }
        );
        if (message.task == "question-answering") {
          const context = await getInnerHTMLFromPage();
          console.log("context is ", context);
          let result = await model(message.query, context); // 2. Run model prediction
          console.log("Service worker result", result);
          sendResponse(result); // 3. Send response back to
        } else if (message.task == "summarization") {
          const context = await getInnerHTMLFromPage();
          let result = await model(context); // 2. Run model prediction
          console.log("Service worker result", result);
          sendResponse(result[0]); // 3. Send response back to
        } else {
          let result = await model(message.query); // 2. Run model prediction
          console.log("Service worker result", result);
          sendResponse(result); // 3. Send response back to
        }
      } else {
        sendResponse("Wrong selection");
      }
    })();

    // return true to indicate we will send a response asynchronously
    // see https://stackoverflow.com/a/46628145 for more information
    return true;
  });
}

// install
chrome.runtime.onInstalled.addListener((details) => {
  console.log(details);
});
