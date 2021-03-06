import { useState } from 'react';

const Toggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  return [isOpen, toggle];
};

export default Toggle;
