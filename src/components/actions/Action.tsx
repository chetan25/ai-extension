import { useEffect, useState, useRef, MouseEvent } from "react";
import { getStoredModels, LocalStorage } from "../../utils/storage";

const Toast = ({ message }: { message: string }) => {
  return (
    <div
      id="toast-success"
      className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div className="ms-3 text-sm font-normal">{message}</div>
    </div>
  );
};

const Action = () => {
  const [installedModels, setInstalledModels] = useState<
    LocalStorage["models"] | null
  >(null);
  const [loadding, setLloading] = useState(false);
  const [results, setResults] = useState({
    analyze: "",
    summarize: "",
    question: "",
  });
  const analyzeRef = useRef<HTMLInputElement | null>(null);
  const questionRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // load stored models
    const loadModels = async () => {
      const models = await getStoredModels();
      console.log(models, "in effect");
      setInstalledModels(models ?? []);
    };
    loadModels();
  }, []);

  const analyzeSentiment = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLloading(true);
    chrome.runtime.sendMessage(
      {
        type: "predict",
        task: "text-classification",
        query: analyzeRef.current!.value,
      },
      (response: { label: string }[]) => {
        setLloading(false);
        console.log(`Result: ${response[0].label}`);
        setResults({
          analyze: `The Sentiment is ${response[0].label}`,
          summarize: "",
          question: "",
        });
      }
    );
  };

  const askQuestion = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    chrome.runtime.sendMessage(
      {
        type: "predict",
        task: "question-answering",
        query: questionRef.current!.value,
      },
      (response: { label: string }[]) => {
        setLloading(false);
        console.log(`Result: ${response[0]}`);
        // setResults({
        //   analyze: ,
        //   summarize: "",
        //   question: "",
        // });
      }
    );
  };

  if (!installedModels || installedModels.length == 0) {
    return (
      <div
        id="toast-warning"
        className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
          </svg>
          <span className="sr-only">Warning icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">
          You don't have any models loaded, please load the models first.
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-6 md:grid-cols-1">
      {installedModels.map((model) => {
        if (model == "text-classification") {
          return (
            <form>
              <div className="flex mb-4 flex-row">
                <input
                  type="text"
                  id="text-classification"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Sentiment to Analyze"
                  required
                  ref={analyzeRef}
                />
                <button
                  type="button"
                  onClick={analyzeSentiment}
                  disabled={loadding}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Analyze Sentiment
                </button>
              </div>
              {results.analyze ? <Toast message={results.analyze} /> : null}
            </form>
          );
        }

        if (model == "question-answering") {
          return (
            <form>
              <div className="flex mb-4 flex-row">
                <input
                  type="text"
                  id="question-answering"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Paste in your question"
                  required
                  ref={questionRef}
                />
                <button
                  type="submit"
                  disabled={loadding}
                  onClick={askQuestion}
                  className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Ask Questions
                </button>
              </div>
              {results.question ? <Toast message={results.question} /> : null}
            </form>
          );
        }

        if (model == "summarization") {
          return (
            <form>
              <div className="mb-4 w-full">
                <button
                  type="submit"
                  disabled={loadding}
                  className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Summarize Current Page
                </button>
              </div>
              {results.summarize ? <Toast message={results.summarize} /> : null}
            </form>
          );
        }
      })}
    </div>
  );
};

export default Action;
