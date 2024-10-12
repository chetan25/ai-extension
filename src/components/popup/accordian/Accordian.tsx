import { ReactNode, MouseEvent, useState } from "react";

type AccordianType = {
  title1: ReactNode;
  content1: ReactNode;
  title2: ReactNode;
  content2: ReactNode;
  currentOpen: "title1" | "title2";
};
const Accordian = ({
  title1,
  title2,
  content1,
  content2,
  currentOpen,
}: AccordianType) => {
  const [currentAccordian, setCurrentAccordian] = useState<string>(currentOpen);

  const handleClick = (e: MouseEvent<HTMLButtonElement>, accordian: string) => {
    e.preventDefault();
    console.log({ accordian });
    setCurrentAccordian(currentAccordian === "title1" ? "title2" : "title1");
  };

  const activeClassName =
    "bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white";

  return (
    <div
      id="accordion-color"
      data-accordion="collapse"
      data-active-classNames="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white"
    >
      <h2 id="accordion-color-heading-1">
        <button
          type="button"
          className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-md focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3 ${
            currentAccordian == "title1" ? activeClassName : ""
          }`}
          data-accordion-target="#accordion-color-body-1"
          aria-expanded={currentAccordian == "title1" ? "true" : "false"}
          aria-controls="accordion-color-body-1"
          onClick={(e) => handleClick(e, "title1")}
        >
          <span>{title1}</span>
          <svg
            data-accordion-icon
            className="w-3 h-3 rotate-180 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-color-body-1"
        className={currentAccordian == "title1" ? "" : "hidden"}
        aria-labelledby="accordion-color-heading-1"
      >
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-2 text-gray-500 dark:text-gray-400">{content1}</p>
        </div>
      </div>
      <h2 id="accordion-color-heading-2" className="mt-4">
        <button
          type="button"
          className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3 ${
            currentAccordian == "title2" ? activeClassName : ""
          }`}
          data-accordion-target="#accordion-color-body-2"
          aria-expanded={currentAccordian == "title2" ? "true" : "false"}
          aria-controls="accordion-color-body-2"
          onClick={(e) => handleClick(e, "title2")}
        >
          <span>{title2}</span>
          <svg
            data-accordion-icon
            className="w-3 h-3 rotate-180 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-color-body-2"
        className={currentAccordian == "title2" ? "" : "hidden"}
        aria-labelledby="accordion-color-heading-2"
      >
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
          <p className="mb-2 text-gray-500 dark:text-gray-400">{content2}</p>
        </div>
      </div>
    </div>
  );
};

export default Accordian;
