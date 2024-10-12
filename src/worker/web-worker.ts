/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// background.js - Handles requests from the UI, runs the model, then sends back a response
import { pipeline, env, PipelineType } from "@xenova/transformers";

// declare global {
//   interface Window {
//     runtime: any;
//     contextMenus: any;
//     scripting: any;
//   }
// }

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

  // Actually perform the classification

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

// // Create generic classify function, which will be reused for the different types of events.
// const classify = async (text: string) => {
//   // Get the pipeline instance. This will load and build the model when run for the first time.
//   const model = await PipelineSingleton.getInstance((data: any) => {
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

////////////////////// 1. Context Menus //////////////////////
//
// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
// window.runtime.onInstalled.addListener(function () {
//   // Register a context menu item that will only show up for selection text.
//   window.contextMenus.create({
//     id: "classify-selection",
//     title: 'Classify "%s"',
//     contexts: ["selection"],
//   });
// });

// // Perform inference when the user clicks a context menu
// window.contextMenus.onClicked.addListener(async (info: any, tab: any) => {
//   console.log(info, tab);
//   // Ignore context menu clicks that are not for classifications (or when there is no input)
//   if (info.menuItemId !== "classify-selection" || !info.selectionText) return;

//   // Perform classification on the selected text
//   const result = await classify(info.selectionText);
//   console.log(result);
//   // Do something with the result
//   window.scripting.executeScript({
//     target: { tabId: tab.id }, // Run in the tab that the user clicked in
//     args: [result], // The arguments to pass to the function
//     function: (result: any) => {
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
// window.runtime.onMessage.addListener(
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
/////////////////
