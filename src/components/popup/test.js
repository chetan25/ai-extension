// const handleWeb = () => {
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   console.log("Web Worker", worker.current);
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   // worker.current.postMessage({ text: "I am Sad" });
// };

// const handleServ = () => {
//   if (typeof window !== "undefined") {
//     console.log("Window exists");
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     chrome.runtime.sendMessage("btnCLick", (response) => {
//       // 2. Handle results returned by the service worker (`background.js`) and update the UI.
//       // outputElement.innerText = JSON.stringify(response, null, 2);
//       console.log(response);
//     });
//   }
// };
