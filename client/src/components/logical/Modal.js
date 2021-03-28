import { useState } from 'react';

const ModalSwitch = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return [isOpen, toggleModal];
}

export default ModalSwitch;