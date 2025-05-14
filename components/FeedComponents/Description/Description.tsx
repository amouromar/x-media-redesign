import React from "react";

interface DescriptionProps {
  text: string;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-md font-normal text-gray-700">{text}</p>
    </div>
  );
};

export default Description;
