import { toast } from "react-toastify";

export function SuccessNotify(notiff) {
  toast.success(notiff, {
    toastClassName: "toastClassName",
    position: "bottom-center",
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: true,
  });
}

export function ErrorNotify(notiff) {
  toast.error(notiff, {
    position: "top-center",
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
export function InfoNotify(notiff) {
  toast.info(notiff, {
    position: "bottom-center",
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
export function WarnNotify(notiff) {
  toast.warn(notiff, {
    position: "bottom-center",
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export { toast };
