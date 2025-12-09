import React from "react";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white p-4 rounded-lg mt-20 lg:mx-20  ">{children}</div>
  );
};

export default Card;
