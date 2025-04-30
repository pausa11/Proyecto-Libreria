import React, { useState } from "react";
import NavBar from "./NavBar";

import EditProfile from "./profile/editProfile";

function MiPerfil() {
  const options = ['editar perfil', 'cambiar contraseña', 'gestion financiera', 'pedidos', 'foro'];
  const [selectedOption, setSelectedOption] = useState('editar perfil');

  const renderContent = () => {
    switch (selectedOption) {
      case 'editar perfil':
        return <EditProfile/>
      case 'cambiar contraseña':
        return <p className="p-6 text-black text-lg">Aquí puedes cambiar tu contraseña.</p>;
      case 'gestion financiera':
        return <p className="p-6 text-black text-lg">Aquí ves tus movimientos financieros.</p>;
      case 'pedidos':
        return <p className="p-6 text-black text-lg">Aquí verás tus pedidos realizados.</p>;
      case 'foro':
        return <p className="p-6 text-black text-lg">Bienvenido al foro de usuarios.</p>;
      default:
        return <p className="p-6 text-black text-lg">Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className="w-full h-screen">
      <NavBar />

      <div className="w-full h-full flex flex-row p-10 bg-[#2B388C] justify-between">
        
        <div className="bg-white w-[25%] rounded-lg p-4">
          <div className="flex flex-col mt-[10vh] gap-4">
            {options.map((option, index) => (
              <button key={index} onClick={() => setSelectedOption(option)} className={`w-full border border-[#2B388C] p-3 rounded-lg text-center font-[300] transition-all font-medium ${ selectedOption === option ? "bg-[#2B388C] text-white" : "text-[#2B388C] hover:bg-gray-100" }`} >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white w-[73%] rounded-lg">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default MiPerfil;
