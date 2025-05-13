import React from "react";

interface DescriptionProps {
  text: string;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-normal">
        {text}
      </p>
    </div>
  );
};

export default Description;
