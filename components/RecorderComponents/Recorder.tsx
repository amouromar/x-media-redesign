"use client";

import React from "react";
import Textarea from "./Textarea/Textarea";
import Selection from "./Selection/Selection";

const Recorder: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea />
      <Selection />
    </div>
  );
};

export default Recorder;
