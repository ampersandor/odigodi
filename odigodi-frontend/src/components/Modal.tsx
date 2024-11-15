import React, { PropsWithChildren } from "react";
import styled from "styled-components";
interface ModalDefaultType {
  onClickToggleModal: () => void;
}

function Modal({onClickToggleModal, children}: PropsWithChildren<ModalDefaultType>) {
  console.log("l-> Modal is rendered")
  return (
    <ModalContainer>
      <DialogBox>{children}</DialogBox>
      <Backdrop
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          if (onClickToggleModal) {
            onClickToggleModal();
          }
        }}
      />
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9999;
  backgroud-color: transparent;
`;

const DialogBox = styled.dialog`
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  border-radius: 3px;
  box-shadow: 0 0 30px rgba(30, 30, 30, 0.185);
  box-sizing: border-box;
  background-color: white;
  z-index: 10000;

  @media (max-width: 767px) {
    /* For screens with a maximum width of 767px (mobile devices) */
    width: 95%;
  }
`;

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);
`;

export default Modal;