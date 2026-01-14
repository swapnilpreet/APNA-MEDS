import { useEffect } from "react";

const JotformAgent = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/agent/embedjs/0198184947d77f338d86224fdb55c466db4e/embed.js?skipWelcome=1&maximizable=1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default JotformAgent;
