import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import Modal from "../components/ui/Modal";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const showModal = useCallback(
    (options) => {
      setModal({
        type: "info",
        ...options,
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      modal,
      showModal,
      closeModal,
    }),
    [modal, showModal, closeModal]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}

      <Modal
        modal={modal}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context =
    useContext(ModalContext);

  if (!context) {
    throw new Error(
      "useModal must be used inside ModalProvider"
    );
  }

  return context;
}