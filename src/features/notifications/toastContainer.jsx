import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import "./notifications.css";

import Toast from "./toast";
import { removeNotification } from "./notificationSlice";

function ToastContainer() {
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state) => state.notifications.active
  );
  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  return createPortal(
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          {...notification}
          onClose={handleClose}
        />
      ))}
    </div>,
    document.body
  );
}

export default ToastContainer;