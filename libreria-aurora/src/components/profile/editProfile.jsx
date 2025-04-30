import React, { useState, useEffect } from "react";
import EditContentPreferences from "./editContentPreference";
import HandleNewsSubscription from "./handleNewsSubscription";

function EditProfile() {
  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/usuarios/perfil/";
  const [userImageExists, setUserImageExists] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [activeSection, setActiveSection] = useState("main"); 
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
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
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    getUserData();
  }, []);

  if (activeSection === "preferences") {
    return (
      <div className="p-10">
        <button onClick={() => setActiveSection("main")} className="mb-4 text-[#3B4CBF]">
          ← Volver al perfil
        </button>
        <EditContentPreferences />
      </div>
    );
  }

  if (activeSection === "subscriptions") {
    return (
      <div className="p-10">
        <button onClick={() => setActiveSection("main")} className="mb-4 text-[#3B4CBF]">
          ← Volver al perfil
        </button>
        <HandleNewsSubscription />
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col gap-2">
      <h1 className="text-3xl font-[500]">Mi Perfil</h1>

      {!userImageExists ? (
        <div className="rounded-full bg-gray-800 h-[20vw] w-[20vw] mx-auto" />
      ) : (
        <img
        src={usuario?.foto_perfil}
        alt="Foto de perfil"
        className="rounded-full h-[20vw] w-[20vw] mx-auto object-cover border"
      />
      )}

<input
  type="text"
  placeholder="URL de nueva foto"
  value={newPhotoUrl}
  onChange={(e) => setNewPhotoUrl(e.target.value)}
  className="p-2 border rounded w-full max-w-md text-black"
/>

<button
  className="text-[#3B4CBF] underline mt-2"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !newPhotoUrl.trim()) {
        setMensajeFoto("⚠️ Debes ingresar una URL válida.");
        return;
      }

      const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/usuarios/actualizar_perfil/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          foto_perfil: newPhotoUrl.trim()
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Error actualizando foto:", error);
        throw new Error("Error al actualizar la foto.");
      }

      setUserImageExists(true);
      setMensajeFoto("✅ Foto de perfil actualizada");
    } catch (err) {
      console.error(err);
      setMensajeFoto("❌ No se pudo actualizar la foto");
    }
  }}
>
  Cambiar foto de perfil
</button>

{mensajeFoto && <p className="text-sm mt-1">{mensajeFoto}</p>}


      <p>Usuario: {usuario?.username || "Cargando..."}</p>
      <p>Correo electrónico: {usuario?.email || "Cargando..."}</p>

      <br />

      <p className="text-[#3B4CBF] cursor-pointer" onClick={() => setActiveSection("preferences")}>
        Personalizar preferencia de contenidos
      </p>
      <p className="text-[#3B4CBF] cursor-pointer" onClick={() => setActiveSection("subscriptions")}>
        Gestionar suscripción a noticias
      </p>
      <p className="text-[#3B4CBF]">Eliminar cuenta</p>
      <p className="text-[#3B4CBF]">Cerrar sesión</p>
    </div>
  );
}

export default EditProfile;
