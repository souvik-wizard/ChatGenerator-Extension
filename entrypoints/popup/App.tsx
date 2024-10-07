import React from "react";
import Logo from "@/assets/logo.svg";

function App() {
  const handleRedirect = () => {
    chrome.tabs.create({ url: "https://www.linkedin.com/messaging/" });
  };

  return (
    <div className="bg-white p-6 w-[340px]">
      <div className="rounded-lg p-8 max-w-md w-full text-center flex justify-center items-center flex-col">
        <img src={Logo} className="logo w-20 mb-4" alt="logo" />
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          LinkedIn Chat Generator
        </h1>
        <p className="text-gray-600 mb-6">
          Generate quick responses for your LinkedIn messages with ease!
        </p>
        <button
          onClick={handleRedirect}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
