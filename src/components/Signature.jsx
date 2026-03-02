import { useContent } from "../content/useContent.js";
import "./signature.scss";

export default function Signature({
  type = "main", // main | emotional
  align = "center",
  variant = "default",
}) {
  const { t } = useContent();

  const text = t(`signature.${type}`, "");

  if (!text) return null;

  return (
    <p
      className={`signature signature--${variant} signature--${align}`}
    >
      {text}
    </p>
  );
}