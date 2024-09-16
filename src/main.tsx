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

const gamepadButtonState: boolean[] = [];

window.addEventListener("keydown", handleKeyDown);

const pollGamepad = () => {
  const gamepads = navigator.getGamepads();

  if (gamepads[0]) {
    const gamepad = gamepads[0];
    gamepad.buttons.forEach((button, index) => {
      const buttonPressed = button.pressed;

      if (gamepadButtonState[index] === undefined) {
        gamepadButtonState[index] = false;
      }
      if (buttonPressed && !gamepadButtonState[index]) {
        switch (index) {
          case 0:
            emitGamepadEvent("b");
            break;
          case 1:
            emitGamepadEvent("a");
            break;
          case 9:
            emitGamepadEvent("start");
            break;
        }
        gamepadButtonState[index] = true;
      }
      if (!buttonPressed && gamepadButtonState[index]) {
        gamepadButtonState[index] = false;
      }
    });
    const leftPressed = gamepad.axes[0] < -0.5;
    const rightPressed = gamepad.axes[0] > 0.5;
    const downPressed = gamepad.axes[1] > 0.5;

    if (leftPressed) emitGamepadEvent("left");
    if (rightPressed) emitGamepadEvent("right");
    if (downPressed) emitGamepadEvent("down");
  }

  requestAnimationFrame(pollGamepad);
};
requestAnimationFrame(pollGamepad);

createRoot(document.getElementById("root")!).render(
  <main className="absolute inset-0" id="mainWrapper">
    <App />
  </main>,
);
