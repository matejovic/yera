import { FunctionalComponent, h } from 'preact';
import './modal.css';

interface ModalProps {
    onClose: () => void;
}

const Modal: FunctionalComponent<ModalProps> = ({ onClose, children }) => {
    const handleOverlayClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) {
          console.log('overlay click')
            onClose();
        }
    };

    return (
        <div class="modal-overlay" onClick={handleOverlayClick}>
            <div class="modal">
                <button class="modal-close" onClick={onClose}>
                    &times;
                </button>
                <div class="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;