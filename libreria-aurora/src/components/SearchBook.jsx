import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

function SearchBooks() {
  const navigate = useNavigate(); 

  // Redirigir al componente de catálogo indicando que debe mostrar la interfaz de búsqueda
  useEffect(() => {
    navigate("/catalogo?search=true");
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      Redirigiendo...
    </div>
  );
}

export default SearchBooks;
