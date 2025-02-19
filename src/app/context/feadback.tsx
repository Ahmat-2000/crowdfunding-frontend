"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";

type FeedbackType = {
  message: string;
  type: "success" | "error" | "info";
};

type FeedbackContextType = {
  feedback: FeedbackType | null;
  setFeedback: ({ message, type }: FeedbackType) => void;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedback, setFeedbackState] = useState<FeedbackType | null>(null);
  
  const setFeedback = ({ message, type }: FeedbackType) => {
    setFeedbackState({ message, type });
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedbackState(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  
  return (
    <FeedbackContext.Provider value={{ feedback, setFeedback }}>
      {feedback && (
        <div
          className={`flex justify-evenly items-center sticky top-1 m-2 px-4 py-2 rounded-md shadow-md bg-gray-300 text-center font-semibold transition-opacity duration-500 ${
            feedback.type === "success"
              ? "text-green-600"
              : feedback.type === "error"
              ? "text-red-600"
              : "text-blue-600"
          }`}
        >
          {feedback.message}
          <button
            onClick={() => setFeedbackState(null)}
            className="absolute right-1"
          >
            <Hamburger
              toggled={true}
              toggle={() => {}}
              size={15}
              color="black"
              label="Close"
            />
          </button>
        </div>
      )}
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
