"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type FeedbackType = {
  message: string;
  type: "success" | "error" | "info";
};

type FeedbackContextType = {
  feedback: FeedbackType | null;
  setFeedback: ({message,type} : FeedbackType) => void;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedback, setFeedbackState] = useState<FeedbackType | null>(null);

  const setFeedback = ({message,type} : FeedbackType) => {
    setFeedbackState({ message, type });
    console.log("from setstate : " + feedback);
  };

  useEffect(() => {
    console.log("from useeffect : " + feedback);
    
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedbackState(null);
      }, 4000);

      return () => clearTimeout(timer); 
    }
  }, [feedback]);

  return (
    <FeedbackContext.Provider value={{ feedback, setFeedback }}>
      {feedback && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-md shadow-md text-white text-center font-semibold transition-opacity duration-500 ${
            feedback.type === "success" ? "bg-green-600" :
            feedback.type === "error" ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {feedback.message}
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
