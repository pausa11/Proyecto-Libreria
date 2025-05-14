import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../api/config";

function EditContentPreferences() {
  const [preferences, setPreferences] = useState({
    recibir_actualizaciones: false,
    recibir_noticias: false,
    recibir_descuentos: false,
    recibir_mensajes_foro: false,
  });

  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const preferencesUrl = getApiUrl("/api/usuarios/preferencias_suscripcion/");
  const updatePreferencesUrl = getApiUrl("/api/usuarios/actualizar_preferencias/");

  // Cargar preferencias actuales del usuario
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(preferencesUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron obtener las preferencias");
        }

        const data = await response.json();
        setPreferences({
          recibir_actualizaciones: data.recibir_actualizaciones,
          recibir_noticias: data.recibir_noticias,
          recibir_descuentos: data.recibir_descuentos,
          recibir_mensajes_foro: data.recibir_mensajes_foro,
        });
      } catch (error) {
        setMensaje("Error al cargar las preferencias ❌");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [preferencesUrl]);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMensaje(null);

      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(updatePreferencesUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar preferencias");
      }

      const data = await response.json();
      setMensaje("✅ Preferencias actualizadas correctamente");
      console.log("Preferencias actualizadas:", data);
    } catch (error) {
      setMensaje("❌ Hubo un error al actualizar las preferencias");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-lg text-gray-700">Cargando preferencias...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Preferencias de Contenido</h2>

      <div className="flex flex-col gap-4">
        {[
          { key: "recibir_actualizaciones", label: "Recibir actualizaciones" },
          { key: "recibir_noticias", label: "Recibir noticias" },
          { key: "recibir_descuentos", label: "Recibir descuentos" },
          { key: "recibir_mensajes_foro", label: "Recibir mensajes del foro" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences[key]}
              onChange={() => handleToggle(key)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={`mt-6 px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-[#3B4CBF]"}`}
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar preferencias"}
      </button>

      {mensaje && <p className="mt-4 text-sm">{mensaje}</p>}
    </div>
  );
}

export default EditContentPreferences;
