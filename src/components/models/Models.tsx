import { useEffect, useState, MouseEvent } from "react";
import Card from "../spinner/card/card";
import {
  getStoredModels,
  LocalStorage,
  setLocalStorage,
} from "../../utils/storage";
import { AVAILABLE_MODELS } from "../../utils/data";

const Models = () => {
  const [installedModels, setInstalledModels] = useState<
    LocalStorage["models"]
  >([]);

  useEffect(() => {
    // load stored models
    const loadModels = async () => {
      const models = await getStoredModels();
      console.log(models, "in effect");
      setInstalledModels(models ?? []);
    };
    loadModels();
  }, []);

  const onModelSelect = (e: MouseEvent<HTMLElement>, task: string) => {
    e.preventDefault();
    if (!installedModels.includes(task)) {
      console.log({ task });
      console.log({ installedModels });
      const updatedModels = installedModels
        ? [...installedModels, task]
        : [task];
      setLocalStorage(updatedModels);
      setInstalledModels(updatedModels);
      chrome.runtime.sendMessage(
        {
          type: "add",
          task: task,
        },
        (response: string) => {
          console.log(`Result: ${response}`);
        }
      );
    }
  };

  return (
    <div>
      <h3 className="mb-5 text-md font-medium text-gray-900 dark:text-white">
        Available models
      </h3>
      <ul className="grid w-full gap-2 md:grid-cols-2">
        {AVAILABLE_MODELS.map((model) => {
          return (
            <Card
              data={model}
              key={model.task}
              onModelSelect={onModelSelect}
              installedModels={installedModels}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Models;
