/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import "./popup.css";
import Accordian from "./accordian/Accordian";
import Models from "../models/Models";
import Action from "../actions/Action";

const App: FC<{}> = () => {
  const worker = useRef<Worker | undefined>(undefined);

  useEffect(() => {
    worker.current = new Worker(
      new URL("../../worker/web-worker.ts", import.meta.url),
      {
        name: "worker",
      }
    );
    // worker.current.postMessage({ text: "I am happy" });

    // worker.current.onmessage = function (event) {
    //   console.log("Recieved from Web worker", event.data.output);
    //   alert(
    //     `Hello from WEB WORKER ${event.data.status} -- ${event.data.output[0].label}`
    //   );
    // };

    // // Attach the callback function as an event listener.
    // worker.addEventListener("message", onMessageReceived);

    // worker.postMessage({ text: "I am good" });

    // if (window) {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   chrome.runtime.sendMessage("What a dull day", (response: any) => {
    //     console.log("Resonse from Service worker", response);
    //     alert(`Hello from Service WORKER ${response}`);
    //   });
    // }
  }, []);

  // const handleServiceWorker = () => {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   chrome.runtime.sendMessage("What a beauttiful day", (response: any) => {
  //     console.log("Resonse from Service worker", response);
  //     alert(`Hello from Service WORKER ${response}`);
  //   });
  // };

  const handleWebWorker = () => {
    worker.current!.postMessage({ text: "I am Sad" });

    worker.current!.onmessage = function (event) {
      console.log("Recieved from Web worker", event.data.output);
      alert(
        `Hello WEB WORKER ${event.data.status} -- ${event.data.output[0].label}`
      );
    };
  };

  return (
    <div className="popup-wrapper">
      <div className="relative items-center block max-w-sm p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
        <h3 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white opacity-20">
          Multi AI Assistance
        </h3>
        <Accordian
          title1="Select Models to load"
          content1={<Models />}
          title2="Available Actions"
          content2={<Action />}
          currentOpen={"title2"}
        />
      </div>
    </div>
  );
};

const domNode = document.getElementById("root");
const root = createRoot(domNode!);
root.render(<App />);
