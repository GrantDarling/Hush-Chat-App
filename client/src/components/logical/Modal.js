import { useState } from 'react';

const ModalSwitch = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
        console.log(isOpen);
    };

    return [isOpen, toggleModal];
}

export default ModalSwitch;