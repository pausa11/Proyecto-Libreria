import React, { useState } from "react";
import NavBar from "./NavBar";

import EditProfile from "./profile/editProfile";
import FinancialManagement from "./profile/financialManagement";
import ChangePassword from "./profile/ChangePassword";

function MiPerfil() {
  const options = ['editar perfil', 'cambiar contraseña', 'gestion financiera', 'pedidos', 'foro'];
  const [selectedOption, setSelectedOption] = useState('editar perfil');

  const renderContent = () => {
    switch (selectedOption) {
      case 'editar perfil':
        return <EditProfile/>
      case 'cambiar contraseña':
        return <ChangePassword/>;
      case 'gestion financiera':
        return <FinancialManagement/>
      case 'pedidos':
        return <p className="p-6 text-black text-lg">Aquí verás tus pedidos realizados.</p>;
      case 'foro':
        return <p className="p-6 text-black text-lg">Bienvenido al foro de usuarios.</p>;
      default:
        return <p className="p-6 text-black text-lg">Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <NavBar />

      <div className="w-full flex-grow flex flex-col lg:flex-row p-4 lg:p-10 bg-[#2B388C]">
        {/* Sidebar - Menu de opciones */}
        <div className="w-full lg:w-[25%] lg:mr-6 mb-4 lg:mb-0">
          <div className="bg-white rounded-lg p-4 sticky top-4">
            <div className="flex flex-row lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-visible">
              {options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => setSelectedOption(option)} 
                  className={`whitespace-nowrap lg:whitespace-normal border border-[#2B388C] p-2 lg:p-3 rounded-lg text-center font-[300] transition-all font-medium ${ 
                    selectedOption === option ? "bg-[#2B388C] text-white" : "text-[#2B388C] hover:bg-gray-100" 
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal - Se adapta al contenido */}
        <div className="w-full lg:w-[75%] bg-white rounded-lg overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;
