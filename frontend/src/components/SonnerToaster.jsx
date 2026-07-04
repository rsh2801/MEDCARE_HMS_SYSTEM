import { Toaster } from "sonner";
import { useTheme } from "../context/ThemeContext";

const SonnerToaster = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-center"
      richColors
      closeButton
    />
  );
};

export default SonnerToaster;
