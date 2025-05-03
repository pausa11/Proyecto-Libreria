import React, { useState, useEffect } from "react";
import EditContentPreferences from "./editContentPreference";
import HandleNewsSubscription from "./handleNewsSubscription";
import { getApiUrl } from "../../api/config";

function EditProfile() {
  const backendURL = getApiUrl("/api/usuarios/perfil/");
  const updateProfileUrl = getApiUrl("/api/usuarios/actualizar_perfil/");
  const [userImageExists, setUserImageExists] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [activeSection, setActiveSection] = useState("main"); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mensajeFoto, setMensajeFoto] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(backendURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }

        const data = await response.json();
        setUsuario(data);
        
        // Verificar si el usuario tiene foto de perfil
        if (data.foto_perfil) {
          setUserImageExists(true);
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    getUserData();
  }, []);

  // Limpiar la URL de la vista previa cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Manejar la selección de archivo
  const handleFileSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Limpiar cualquier URL previa y crear una nueva para previsualización
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // Función para subir la imagen
  const uploadImage = async () => {
    if (!selectedFile) {
      setMensajeFoto("⚠️ Por favor selecciona una imagen");
      return;
    }
    
    setIsUploading(true);
    setMensajeFoto("⏳ Subiendo imagen...");
    
    try {
      const formData = new FormData();
      formData.append('foto_perfil', selectedFile);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(updateProfileUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          // No establecer Content-Type, el navegador lo hará automáticamente con el límite correcto
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir la imagen");
      }
      
      const data = await response.json();
      setUsuario(data);
      setUserImageExists(true);
      setMensajeFoto("✅ Foto de perfil actualizada");
      
      // Limpiar vista previa después de éxito
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      setSelectedFile(null);
    } catch (error) {
      console.error("Error:", error);
      setMensajeFoto("❌ " + (error.message || "No se pudo actualizar la foto"));
    } finally {
      setIsUploading(false);
    }
  };

  if (activeSection === "preferences") {
    return (
      <div className="p-4 lg:p-6">
        <button onClick={() => setActiveSection("main")} className="mb-4 text-[#3B4CBF] hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al perfil
        </button>
        <div className="overflow-auto">
          <EditContentPreferences />
        </div>
      </div>
    );
  }

  if (activeSection === "subscriptions") {
    return (
      <div className="p-4 lg:p-6">
        <button onClick={() => setActiveSection("main")} className="mb-4 text-[#3B4CBF] hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al perfil
        </button>
        <div className="overflow-auto">
          <HandleNewsSubscription />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-[500] mb-4 lg:mb-6">Mi Perfil</h1>

      {/* Sección de foto de perfil con diseño mejorado */}
      <div className="bg-gray-50 rounded-lg p-4 lg:p-6 mb-4 lg:mb-6 shadow-sm">
        <h2 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">Foto de Perfil</h2>
        
        <div className="flex flex-col md:flex-row md:items-start gap-4 lg:gap-6">
          {/* Imagen actual o placeholder */}
          <div className="flex flex-col items-center">
            <p className="text-xs lg:text-sm font-medium mb-2 text-gray-600">Actual</p>
            {userImageExists && usuario?.foto_perfil ? (
              <img
                src={usuario.foto_perfil}
                alt="Foto de perfil"
                className="rounded-full h-20 w-20 lg:h-24 lg:w-24 object-cover border border-gray-300"
              />
            ) : (
              <div className="rounded-full bg-gray-700 h-20 w-20 lg:h-24 lg:w-24 flex items-center justify-center text-white text-xl lg:text-2xl">
                {usuario?.first_name?.charAt(0) || usuario?.username?.charAt(0) || '?'}
              </div>
            )}
          </div>
          
          {/* Vista previa si existe */}
          {preview && (
            <div className="flex flex-col items-center">
              <p className="text-xs lg:text-sm font-medium mb-2 text-gray-600">Vista previa</p>
              <img 
                src={preview} 
                alt="Vista previa" 
                className="rounded-full h-20 w-20 lg:h-24 lg:w-24 object-cover border border-blue-300" 
              />
            </div>
          )}
          
          {/* Controles de selección y subida */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <label htmlFor="foto-perfil" className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                Selecciona una nueva imagen
              </label>
              <input
                id="foto-perfil"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="p-1.5 lg:p-2 border border-gray-300 rounded w-full max-w-md text-xs lg:text-sm file:mr-3 lg:file:mr-4 file:py-1.5 lg:file:py-2 file:px-3 lg:file:px-4 file:rounded file:border-0 file:text-xs lg:file:text-sm file:bg-blue-50 file:text-[#3B4CBF] hover:file:bg-blue-100"
              />
            </div>
            
            <button
              className="text-white bg-[#3B4CBF] hover:bg-[#2D3A99] px-3 py-1.5 lg:px-4 lg:py-2 rounded text-sm lg:text-base mt-2 disabled:opacity-50 w-fit"
              onClick={uploadImage}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Subiendo..." : "Subir imagen de perfil"}
            </button>
            
            {mensajeFoto && <p className="text-xs lg:text-sm mt-2">{mensajeFoto}</p>}
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="bg-gray-50 rounded-lg p-4 lg:p-6 mb-4 lg:mb-6 shadow-sm">
        <h2 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">Información Personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div>
            <p className="text-xs lg:text-sm text-gray-600">Usuario</p>
            <p className="font-medium text-sm lg:text-base">{usuario?.username || "Cargando..."}</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600">Correo electrónico</p>
            <p className="font-medium text-sm lg:text-base">{usuario?.email || "Cargando..."}</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600">Nombre</p>
            <p className="font-medium text-sm lg:text-base">{usuario?.first_name || "-"}</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600">Apellido</p>
            <p className="font-medium text-sm lg:text-base">{usuario?.last_name || "-"}</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600">Nacionalidad</p>
            <p className="font-medium text-sm lg:text-base">{usuario?.nacionalidad || "-"}</p>
          </div>
        </div>
      </div>

      {/* Enlaces de gestión */}
      <div className="bg-gray-50 rounded-lg p-4 lg:p-6 shadow-sm">
        <h2 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">Gestionar mi cuenta</h2>
        <div className="flex flex-col gap-2">
          <p className="text-sm lg:text-base text-[#3B4CBF] cursor-pointer hover:underline" onClick={() => setActiveSection("preferences")}>
            Personalizar preferencia de contenidos
          </p>
          <p className="text-sm lg:text-base text-[#3B4CBF] cursor-pointer hover:underline" onClick={() => setActiveSection("subscriptions")}>
            Gestionar suscripción a noticias
          </p>
          <p className="text-sm lg:text-base text-[#3B4CBF] cursor-pointer hover:underline">Eliminar cuenta</p>
          <p className="text-sm lg:text-base text-[#3B4CBF] cursor-pointer hover:underline">Cerrar sesión</p>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
