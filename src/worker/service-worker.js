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
        const model = AVAILABLE_MODELS[task].model;
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

// // Create generic classify function, which will be reused for the different types of events.
// const classify = async (text) => {
//   // Get the pipeline instance. This will load and build the model when run for the first time.
//   const model = await PipelineSingleton.getInstance((data) => {
//     // You can track the progress of the pipeline creation here.
//     // e.g., you can send `data` back to the UI to indicate a progress bar
//     console.log("progress", data);
//   });

//   // Actually run the model on the input text
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   const result = await model(text);
//   return result;
// };

// //////////////////// 1. Context Menus //////////////////////

// // Add a listener to create the initial context menu items,
// // context menu items only need to be created at runtime.onInstalled
// chrome.runtime.onInstalled.addListener(function () {
//   // Register a context menu item that will only show up for selection text.
//   chrome.contextMenus.create({
//     id: "classify-selection",
//     title: 'Classify "%s"',
//     contexts: ["selection"],
//   });
// });

// // Perform inference when the user clicks a context menu
// chrome.contextMenus.onClicked.addListener(async (info, tab) => {
//   console.log(info, tab);
//   // Ignore context menu clicks that are not for classifications (or when there is no input)
//   if (info.menuItemId !== "classify-selection" || !info.selectionText) return;

//   // Perform classification on the selected text
//   const result = await classify(info.selectionText);
//   console.log(result);
//   // Do something with the result
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id }, // Run in the tab that the user clicked in
//     args: [result], // The arguments to pass to the function
//     function: (result) => {
//       // The function to run
//       // NOTE: This function is run in the context of the web page, meaning that `document` is available.
//       console.log("result", result);
//       console.log("document", document);
//     },
//   });
// });
// //////////////////////////////////////////////////////////////

// ////////////////////// 2. Message Events /////////////////////
// //
// // Listen for messages from the UI, process it, and send the result back.
// chrome.runtime.onMessage.addListener(
//   (message: any, sender: any, sendResponse: any) => {
//     console.log("sender", sender);
//     if (message.action !== "classify") return; // Ignore messages that are not meant for classification.

//     // Run model prediction asynchronously
//     (async function () {
//       // Perform classification
//       const result = await classify(message.text);

//       // Send response back to UI
//       sendResponse(result);
//     })();

//     // return true to indicate we will send a response asynchronously
//     // see https://stackoverflow.com/a/46628145 for more information
//     return true;
//   }
// );
// ///////////////
