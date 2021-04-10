import { useState } from 'react';

const Modal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {

        setIsOpen(!isOpen);
    };

    return [isOpen, toggleModal];
}

export default Modal;