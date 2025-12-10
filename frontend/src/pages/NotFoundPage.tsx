import { useNavigate } from "react-router-dom";
import img_404 from "../assets/images/404.png";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#191a2a] flex flex-col justify-center items-center text-center px-4">
      <img src={img_404} className="w-[20vw] ml-5"></img>
      <p className="text-lg text-yellow-300 mt-3 font-semibold">
        The page you are trying to access does not exist !!!
      </p>
      <p className="text-sm text-yellow-200 mt-2">
       Please check your internet connection or link.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 transition duration-200"
      >
        Return &gt;
      </button>
    </div>
  );
}
