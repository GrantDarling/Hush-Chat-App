const ModalCreateRoom = (toggleModal, setRoom, room) => {

  const onSubmit = (e) => {
    e.preventDefault();
    toggleModal();
    setRoom({ ...room, isCreated: true });
  }

    return [onSubmit];
}

export default ModalCreateRoom;