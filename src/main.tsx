import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

function generateRandomHexStrings(count, length) {
  const hexStrings = [];

  for (let i = 0; i < count; i++) {
    let hexString = "";
    for (let j = 0; j < length / 4; j++) {
      // Generate a random 16-bit number and convert it to a 4-character hex string
      const randomSegment = ((Math.random() * 0xffff) | 0)
        .toString(16)
        .padStart(4, "0");
      hexString += randomSegment;
    }
    hexStrings.push(hexString);
  }

  return hexStrings;
}

export const randomHexStrings = generateRandomHexStrings(100, 256);

createRoot(document.getElementById("root")!).render(
  <main className="absolute inset-0 flex justify-center items-center">
    <App />
  </main>,
);
