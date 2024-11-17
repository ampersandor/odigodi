import React, { useCallback, memo } from "react";
import "./Modal.css";

interface ModalProps {
  onClickToggleModal: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = memo(({ onClickToggleModal, children }) => {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // 백드롭을 직접 클릭했을 때만 모달 닫기
    if (e.target === e.currentTarget) {
      onClickToggleModal();
    }
  }, [onClickToggleModal]);

  return (
    <div className="modal-container" onClick={handleBackdropClick}>
      <div className="dialog-box" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;