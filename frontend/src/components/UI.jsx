import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Markdown from "react-markdown";

const UI = () => {
  const [socket, setSocket] = useState(null);
  const [inputText, setInputText] = useState("");

  const [allMessages, setAllMessages] = useState([]);

  const handleMessage = () => {
    if (inputText.trim() === "") return;
    const userMsg = {
      id: Date.now(),
      timeStamp: new Date().toLocaleTimeString(),
      text: inputText,
      sender: "user",
    };

    setAllMessages((previouse) => [...previouse, userMsg]);

    socket.emit("ai-message", inputText);

    setInputText("");
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("ai-message-response", (data) => {
      const botMsg = {
        id: Date.now(),
        timeStamp: new Date().toLocaleTimeString(),
        text: data,
        sender: "bot",
      };

      setAllMessages((previouse) => [...previouse, botMsg]);
    });
  }, []);

  return (
    <div className="w-[95%] xs:w-[450px] h-[95%] xs:h-[90%] bg-[url(/chatbg.png)] bg-cover rounded-xl overflow-hidden relative">
      <h2 className="text-center bg-linear-to-r from-fuchsia-500 to-purple-700 text-white py-2 text-xl font-medium">
        AI Chat-Bot
      </h2>
      <div className="relative h-full w-full p-2 flex flex-col gap-2 items-start justify-start overflow-y-auto">
        {allMessages.length === 0 ? (
          <p className="absolute top-[42%] left-[50%] translate-[-50%] opacity-70 text-purple-900 select-none">
            Start a new conversation
          </p>
        ) : (
          allMessages.map((msg, idx) => {
            return (
              <div
                key={idx}
                className={`${
                  msg.sender === "user"
                    ? "bg-purple-400 rounded-br-none ml-auto"
                    : "bg-white rounded-tl-none mt-2"
                } rounded-2xl shadow shadow-black/30 py-2 px-3 w-fit max-w-[80%]`}
              >
                <p>
                  {" "}
                  {msg.sender === "user" ? (
                    msg.text
                  ) : (
                    <Markdown>{msg.text}</Markdown>
                  )}{" "}
                </p>
              </div>
            );
          })
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full flex items-center gap-1 p-2 ">
        <input
          className="bg-white border-2 border-purple-900 text-purple-900 outline-none placeholder:text-purple-900 py-3 px-4 w-full rounded-bl-full rounded-tl-full"
          type="text"
          placeholder="Enter something.."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          onClick={handleMessage}
          className="bg-purple-900 text-white border-2 cursor-pointer border-purple-900 py-3 px-4 rounded-br-full rounded-tr-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default UI;
