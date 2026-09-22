import { useSelector } from "react-redux";
import "./loader.css";

export default function Loader() {
  const count = useSelector((state) => state.loader.count);

  if (count === 0) {
    return null;
  }

  return (
    <div className="loader-overlay">
      <div className="loader" />
    </div>
  );
}