import React from "react";
import { Mail, Key } from "lucide-react";

function Input({ type, placeholder, value, onChange, name }) {

  const handleIcon = (type) => {
    switch (type) {
      case "text":
        return <Mail color="#1B2459" size={"1.2vw"} />;
      case "password":
        return <Key color="#1B2459" size={"1.2vw"} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[60%] h-[5vh] flex items-center gap-[1vw] border-[.1vh] border-black rounded-[.7vw] p-[1vw] text-[1vw] font-[200]">
      <div>{handleIcon(type)}</div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-[100%] h-[5vh] outline-none bg-transparent text-[#787767]"
      />
      <style jsx>{`
        /* Neutralizar estilos de autocompletado */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          transition: background-color 9999s ease-in-out 0s;
          -webkit-text-fill-color: inherit !important;
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          background-clip: content-box !important;
        }
        
        /* Para Firefox */
        @-moz-document url-prefix() {
          input:-moz-autofill,
          input:-moz-autofill:focus {
            transition: background-color 9999s ease-in-out 0s;
            -moz-text-fill-color: inherit !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Input;
