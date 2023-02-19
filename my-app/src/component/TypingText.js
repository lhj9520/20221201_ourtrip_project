import React, { useState, useEffect } from "react";

const TypingText = ({ text, fontSize, color }) => {
  const [Text, setText] = useState("");
  const [count, setCount] = useState(0);
  const completionWord = text;

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setText((prevTitleValue) => {
        let result = prevTitleValue
          ? prevTitleValue + completionWord[count]
          : completionWord[0];
        setCount(count + 1);

        if (count >= completionWord.length) {
          setCount(0);
          setText("");
        }

        return result;
      });
    }, 500);

    return () => {
      clearInterval(typingInterval);
    };
  });

  return (
    <p
      style={{
        fontSize: `${fontSize}`,
        color: `${color}`,
      }}
    >
      {Text}
    </p>
  );
};

export default TypingText;
