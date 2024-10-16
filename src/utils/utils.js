const getInnerText = () => {
  return document.body.innerText;
};

export async function getInnerHTMLFromPage() {
  let queryOptions = { active: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log({ tab });
  let tabId = tab.id;
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    func: getInnerText,
    // args: [answer],
  });

  const context = result[0].result;
  console.log({ context });

  return context;
}
