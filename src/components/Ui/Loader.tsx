import { RiseLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex bg-transparent items-center justify-center">
      <RiseLoader size={10} color="#f9f9f9" />
    </div>
  );
}
