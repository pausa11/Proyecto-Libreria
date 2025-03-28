import React from "react";
import { Mail, Key ,Calendar , House, User, CaseUpper , IdCard, Phone} from "lucide-react";

function Input({ type, placeholder, value, onChange, name}) {

  const handleIcon = (placeholder) => {
    switch (placeholder) {
      case "Correo electrónico":
        return <Mail color="#1B2459" size={"1.2vw"} />;
      case "Contraseña":
        return <Key color="#1B2459" size={"1.2vw"} />;
      case "Confirmar contraseña":
        return <Key color="#1B2459" size={"1.2vw"} />;
      case "Fecha de nacimiento":
        return <Calendar color="#1B2459" size={"1.2vw"} />;
      case "Dirección":
        return <House color="#1B2459" size={"1.2vw"} />;
      case "Crea tu usuario":
        return <User color="#1B2459" size={"1.2vw"} />;
      case "Nombre":
        return <CaseUpper color="#1B2459" size={"1.2vw"} />;
      case "Apellido": 
        return <CaseUpper color="#1B2459" size={"1.2vw"} />;
      case "Número de identificación":  
        return <IdCard color="#1B2459" size={"1.2vw"} />;
      case "Teléfono":
        return <Phone color="#1B2459" size={"1.2vw"} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[60%] h-[5vh] flex items-center gap-[1vw] border-[.1vh] border-black rounded-[.7vw] p-[1vw] text-[1vw] font-[200]">
      <div>{handleIcon(placeholder)}</div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-[100%] h-[5vh] outline-none bg-transparent text-[#787767]"
      />
    </div>
  );
}

export default Input;
