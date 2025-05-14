import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

function SearchBooks() {
  const navigate = useNavigate(); 
  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/libros/";
  const filtersArray = [
    { label: "Categoría", key: "categoria" },
    { label: "Año de publicación", key: "año_publicacion" },
    { label: "Autor", key: "autor" },
    { label: "Editorial", key: "editorial" },
    { label: "Precio", key: "precio" },
  ];

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("categoria");
  const [filterValue, setFilterValue] = useState("");

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
