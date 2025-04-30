import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import NavBar from "./NavBar";
import BookCard from "./home/bookCard";
import 'aos/dist/aos.css';
import AOS from 'aos';

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
    const token = localStorage.getItem("token"); 
    if (!token) {
      navigate("/login"); 
      return;
    }

    AOS.init();
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(backendURL);
      if (!response.ok) throw new Error("Error en la petición");
      const data = await response.json();
      console.log("libros", data);
      setBooks(data);
      setFilteredBooks(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setIsLoading(false);
    }
  };

  const handleFilterClick = (filterKey) => {
    setActiveFilter(filterKey);
  };

  const applyFilter = () => {
    if (!filterValue || !activeFilter) return;
    const value = filterValue.toLowerCase();

    const filtered = books.filter((book) => {
      const bookValue = String(book[activeFilter]).toLowerCase();
      return bookValue.includes(value);
    });

    setFilteredBooks(filtered);
    setFilterValue("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando libros...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-auto bg-black text-white">
      <NavBar />

      {activeFilter && (
        <div className="mt-4 w-full max-w-[30vw] flex flex-col p-[2vw]">
          <label className="text-white mb-2 capitalize">
            Valor para {filtersArray.find((f) => f.key === activeFilter)?.label}:
          </label>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={`Ej: 1967, Vintage, 25.99`}
            className="p-2 rounded text-black"
          />
          <button onClick={applyFilter} className="bg-[#E8BD83] mt-2 text-black py-2 rounded">
            Buscar 
          </button>
        </div>
      )}

      <div id="filtro" className="flex flex-col justify-center items-center p-[2vw] w-full">
        <h1 className="text-4xl font-bold w-full">Filtrar por:</h1>
        <div className="w-full flex items-center gap-[1vw] mt-[2vh] flex-wrap">
          {filtersArray.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => handleFilterClick(key)}
              className={`${
                activeFilter === key ? "bg-[#3B4CBF] text-white" : "bg-[#E8BD83]"
              } text-black p-2 rounded-lg transition duration-300 min-w-[7vw]`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div id="resultados" className="w-full flex flex-wrap gap-4 items-left p-[2vw]">
        {filteredBooks.length === 0 ? (
          <p className="text-white">No se encontraron libros.</p>
        ) : (
          filteredBooks.map((book, index) => (
            <BookCard
              key={book.id || index}
              title={book.titulo}
              author={book.autor}
              img={
                book.portada_url ||
                "https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize"
              }
              color="white"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SearchBooks;
