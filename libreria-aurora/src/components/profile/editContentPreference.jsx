import React, { useState, useEffect } from "react";

function EditBookPreferences() {
  const categoriesArray = ['Académico', 'Ficción', 'No Ficción'];
  const [preferencias, setPreferencias] = useState([]);
  const [nuevaPreferencia, setNuevaPreferencia] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // Obtener preferencias actuales
  useEffect(() => {
    const fetchPreferencias = async () => {
      try {
        if (!token) return;

        const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/usuarios/preferencias_libros/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener las preferencias");

        const data = await response.json();
        setPreferencias(data.preferencias || []);
      } catch (error) {
        setMensaje("❌ Error al cargar preferencias");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferencias();
  }, [token]);

  const updatePreferencias = async (nuevasPreferencias) => {
    try {
      setSaving(true);
      setMensaje(null);

      const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/usuarios/preferencias_libros/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ preferencias: nuevasPreferencias }),
      });

      if (!response.ok) throw new Error("Error al actualizar preferencias");

      const data = await response.json();
      setPreferencias(data.preferencias || []);
    } catch (error) {
      setMensaje("❌ Error al actualizar preferencias");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckboxChange = (categoria) => {
    const actualizadas = preferencias.includes(categoria)
      ? preferencias.filter((pref) => pref !== categoria)
      : [...preferencias, categoria];

    updatePreferencias(actualizadas);
  };

  const handleAddPreferencia = () => {
    const nueva = nuevaPreferencia.trim();
    if (!nueva || preferencias.includes(nueva)) return;

    const actualizadas = [...preferencias, nueva];
    updatePreferencias(actualizadas);
    setNuevaPreferencia("");
  };

  if (loading) {
    return <div className="p-6 text-gray-700">Cargando preferencias...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Tus preferencias de libros</h2>

      <div className="grid gap-2 mb-4">
        {categoriesArray.map((categoria) => (
          <label key={categoria} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferencias.includes(categoria)}
              onChange={() => handleCheckboxChange(categoria)}
            />
            {categoria}
          </label>
        ))}
      </div>

      <ul className="list-disc list-inside mb-4">
        {preferencias.length === 0 ? (
          <li>No tienes preferencias agregadas</li>
        ) : (
          preferencias.map((pref, index) => <li key={index}>{pref}</li>)
        )}
      </ul>

      {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
    </div>
  );
}

export default EditBookPreferences;
