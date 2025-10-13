import toast from "react-hot-toast";

export const onGlobalError = (msg: string) => {
  toast.error(msg, {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};
