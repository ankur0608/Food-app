import { useRef, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";
import img from "../assets/5610944.png";
import img2 from "../assets/download.png";
import styles from "./Modal.module.css";

const Modal = forwardRef(
  ({ children, buttonCaption, onModalclose, isSuccess = true }, ref) => {
    const dialog = useRef();

    useImperativeHandle(ref, () => ({
      open() {
        dialog.current.showModal();
      },
    }));

    return createPortal(
      <dialog className={styles.popup} ref={dialog}>
        <img
          src={isSuccess ? img : img2}
          className={styles.img}
          alt={isSuccess ? "Success illustration" : "Erorr illustration"}
        />
        <div>{children}</div>
        <form method="dialog">
          <button onClick={onModalclose} className={styles["btn-ok"]}>
            {buttonCaption}
          </button>
        </form>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default Modal;
