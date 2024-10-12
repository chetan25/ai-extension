import { MouseEvent } from "react";

type Model = {
  task: string;
  model: string;
  description: string;
};

const Card = ({
  data,
  installedModels,
  onModelSelect,
}: {
  data: Model;
  installedModels: string[];
  onModelSelect: (e: MouseEvent<HTMLElement>, task: string) => void;
}) => {
  return (
    <li onClick={(e) => onModelSelect(e, data.task)}>
      <input
        type="checkbox"
        id={data.task}
        value=""
        className="hidden peer"
        required
        checked={installedModels.includes(data.task)}
      />
      <label
        htmlFor={data.task}
        className="inline-flex items-center justify-between p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="block">
          <div className="w-full text-sm font-semibold">
            {data.task.toUpperCase()}
          </div>
          <div className="w-full text-sm">{data.description}</div>
        </div>
      </label>
    </li>
  );
};

export default Card;
