import { FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";

type InstructionsProps = {
  vertical?: boolean;
};

function Instructions({ vertical }: InstructionsProps) {
  if (vertical) {
    return (
      <div className="grid grid-cols-1 gap-16 border-zinc-50 border-2 p-10">
        <div className="flex flex-col gap-2 items-center text-xs">
          <div className="text-xl flex gap-1 items-center">
            <FaArrowLeft />
            <div className="border-zinc-50 border-2 h-8 w-8"></div>
            <FaArrowRight />
          </div>
          <p>Left / Right Arrow </p>
        </div>
        <div className="flex flex-col gap-2 items-center text-xs">
          <div className="text-xl flex gap-1 items-center">
            <div className="border-zinc-50 border-2 h-8 w-8 flex justify-center items-center">
              <FaArrowDown fill="white" />
            </div>
          </div>
          <p>Down Arrow</p>
        </div>
        <div className="flex flex-col gap-2 items-center text-xs">
          <div className="text-xl flex gap-1 items-center">
            <FaArrowRotateLeft />
            <div className="border-zinc-50 border-2 h-8 w-8"></div>
            <FaArrowRotateRight />
          </div>
          <p>A / D Key</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="flex flex-col gap-2 items-center text-xs">
        <div className="text-xl flex gap-1 items-center">
          <FaArrowLeft />
          <div className="border-zinc-50 border-2 h-8 w-8"></div>
          <FaArrowRight />
        </div>
        <p>Left / Right Arrow </p>
      </div>
      <div className="flex flex-col gap-2 items-center text-xs">
        <div className="text-xl flex gap-1 items-center">
          <div className="border-zinc-50 border-2 h-8 w-8 flex justify-center items-center">
            <FaArrowDown fill="white" />
          </div>
        </div>
        <p>Down Arrow</p>
      </div>
      <div className="flex flex-col gap-2 items-center text-xs">
        <div className="text-xl flex gap-1 items-center">
          <FaArrowRotateLeft />
          <div className="border-zinc-50 border-2 h-8 w-8"></div>
          <FaArrowRotateRight />
        </div>
        <p>A / D Key</p>
      </div>
    </div>
  );
}

export default Instructions;
