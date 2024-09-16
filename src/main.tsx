import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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
    case "Enter":
      emitGamepadEvent("start");
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
    const startPressed = gamepad.buttons[9]?.pressed;
    const downPressed = gamepad.axes[1] > 0.5 || gamepad.buttons[13]?.pressed;

    if (leftPressed) emitGamepadEvent("left");
    if (rightPressed) emitGamepadEvent("right");
    if (aPressed) emitGamepadEvent("a");
    if (bPressed) emitGamepadEvent("b");
    if (downPressed) emitGamepadEvent("down");
    if (startPressed) emitGamepadEvent("start");
  }

  requestAnimationFrame(pollGamepad);
};
requestAnimationFrame(pollGamepad);

createRoot(document.getElementById("root")!).render(
  <main className="absolute inset-0" id="mainWrapper">
    <App />
  </main>,
);
