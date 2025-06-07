import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getApiUrlByKey } from "../api/config";

import EditProfile from "./profile/editProfile";
import FinancialManagement from "./profile/financialManagement";
import ChangePassword from "./profile/ChangePassword";
import ForumMessages from "./profile/forumMessages";
import AdminForumMessages from "./profile/adminForumMessages";

function MiPerfil() {
  const options = ['editar perfil', 'cambiar contraseña', 'gestion financiera', 'pedidos', 'foro'];
import Pedidos from "./profile/pedidos";
import Reservas from "./profile/reservas";
import AdminLibros from "./profile/adminLibros"; // Importar el nuevo componente

function MiPerfil() {
  const options = ['editar perfil', 'cambiar contraseña', 'gestion financiera','reservas', 'pedidos', 'foro'];
  // Agregar opción solo para staff
  const staffOptions = [...options, 'gestionar libros'];
  const [selectedOption, setSelectedOption] = useState('editar perfil');
  const [isStaff, setIsStaff] = useState(false);
  
  // Verificar si el usuario es staff
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        // Usar la función getApiUrlByKey para obtener la URL correcta desde la configuración centralizada
        const perfilUrl = getApiUrlByKey("usuariosPerfil");
        
        const response = await fetch(perfilUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          // Verificar si el usuario tiene permisos de staff
          if (userData.tipo_usuario === 'ADMIN' || userData.tipo_usuario === 'BIBLIOTECARIO' || userData.is_staff) {
            setIsStaff(true);
          }
        }
      } catch (error) {
        console.error("Error al verificar el rol del usuario:", error);
      }
    };
    
    checkUserRole();
  }, []);

  const renderContent = () => {
    switch (selectedOption) {
      case 'editar perfil':
        return <EditProfile/>;
      case 'cambiar contraseña':
        return <ChangePassword/>;
      case 'gestion financiera':
        return <FinancialManagement/>;
      case 'pedidos':
        return <p className="p-6 text-black text-lg">Aquí verás tus pedidos realizados.</p>;
      case 'foro':
        // Mostrar el componente adecuado según el rol del usuario
        return isStaff ? <AdminForumMessages/> : <ForumMessages/>;
      case 'gestionar libros':
        return isStaff ? <AdminLibros/> : <p className="p-6 text-black text-lg">Acceso restringido.</p>;
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
              {(isStaff ? staffOptions : options).map((option, index) => (
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
