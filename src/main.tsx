import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

function generateRandomHexStrings(count: number, length: number) {
  const hexStrings = [];

  for (let i = 0; i < count; i++) {
    let hexString = "";
    for (let j = 0; j < length / 4; j++) {
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

const emitGamepadEvent = (eventName: string) => {
  window.dispatchEvent(
    new CustomEvent("gamepad-pressed", { detail: eventName }),
  );
};

const handleKeyDown = (e: KeyboardEvent) => {
  console.log(e.code);
  switch (e.code) {
    case "ArrowLeft":
      emitGamepadEvent("left");
      break;
    case "ArrowRight":
      emitGamepadEvent("right");
      break;
    case "KeyS":
      emitGamepadEvent("a");
      break;
    case "KeyA":
      emitGamepadEvent("b");
      break;
    case "ArrowDown":
      emitGamepadEvent("down");
      break;
    default:
      break;
  }
};

window.addEventListener("keydown", handleKeyDown);

const pollGamepad = () => {
  const gamepads = navigator.getGamepads();

  if (gamepads[0]) {
    const gamepad = gamepads[0];
    const leftPressed = gamepad.axes[0] < -0.5 || gamepad.buttons[14]?.pressed;
    const rightPressed = gamepad.axes[0] > 0.5 || gamepad.buttons[15]?.pressed;
    const bPressed = gamepad.buttons[0]?.pressed;
    const aPressed = gamepad.buttons[1]?.pressed;
    const downPressed = gamepad.axes[1] > 0.5 || gamepad.buttons[13]?.pressed;

    if (leftPressed) emitGamepadEvent("gamepad-left");
    if (rightPressed) emitGamepadEvent("gamepad-right");
    if (aPressed) emitGamepadEvent("gamepad-a");
    if (bPressed) emitGamepadEvent("gamepad-b");
    if (downPressed) emitGamepadEvent("gamepad-down");
  }

  requestAnimationFrame(pollGamepad);
};
requestAnimationFrame(pollGamepad);

createRoot(document.getElementById("root")!).render(
  <main className="absolute inset-0" id="mainWrapper">
    <App />
  </main>,
);
