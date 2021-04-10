import { useState } from 'react';

const Modal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = (set) => {
        switch(set) {
            case 'open':
                setIsOpen(true);
                break;
            case 'close':
                setIsOpen(false);
                break;
            default:
                setIsOpen(!isOpen);
        }
    };

    return [isOpen, toggleModal];
}

export default Modal;