import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import BookCard from "./home/bookCard";
import 'aos/dist/aos.css';
import AOS from 'aos';

function Catalogo() {
  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/libros/";
  const filtersArray = ['categoria', 'año_publicacion', 'Autor', 'Editorial', 'Precio'];

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);   

  const fetchBooks = async () => {
    try {
      const response = await fetch(backendURL);
      if (!response.ok) throw new Error("Error en la petición");
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data); // inicial, sin filtros
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFilter = (filterName) => {
    setActiveFilter(filterName);
    const lowercaseFilter = filterName.toLowerCase();

    const filtered = books.filter(book =>
      book[lowercaseFilter] && book[lowercaseFilter] !== ""
    );

    setFilteredBooks(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando libros...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-y-auto overflow-x-hidden bg-black">
      
      <NavBar />

      <div id="filtro" className="flex flex-col justify-center items-center w-full p-[2vw]">
        <h1 className="text-4xl font-bold text-white text-start w-full">filtra por:</h1>
        <div className="w-full flex items-center gap-[2vw] mt-[2vh]">
          {filtersArray.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleFilter(filter)}
              className={`${
                activeFilter === filter ? 'bg-[#D9A76B]' : 'bg-[#E8BD83]'
              } text-black p-2 rounded-lg transition duration-300 min-w-[7vw]`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div id="filtrados" className="w-full flex flex-col p-[2vw]">
        <h1 className="text-white font-[500] text-[3.5vw] w-full">
          {activeFilter ? `Filtrando por ${activeFilter}` : "Todos los libros"}
        </h1>
        <div className="w-full flex flex-wrap justify-between mt-[2vh]">
          {filteredBooks.map((book, index) => (
            <BookCard
              key={book.id || index}
              title={book.titulo}
              author={book.autor}
              img={book.portada_url || "https://via.placeholder.com/150"}
              color="white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Catalogo;
