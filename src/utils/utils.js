const getInnerText = () => {
  return document.body.innerText;
};

export async function getInnerHTMLFromPage() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      console.log({ tabs });
      let tabId = tabs[0].id;
      const result = await chrome.scripting.executeScript({
        target: { tabId },
        func: getInnerText,
        // args: [answer],
      });

      const context = result[0].result;
      return context;
      console.log({ context });
    }
  );
}
