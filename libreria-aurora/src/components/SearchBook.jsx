import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import BookCard from "./home/bookCard";
import 'aos/dist/aos.css';
import AOS from 'aos';

function SearchBooks() {
  const filtersArray = ['Genero', 'Año', 'Autor', 'Editorial', 'Precio'];
  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/libros/";

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init();
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(backendURL);
      if (!response.ok) throw new Error("Error en la petición");
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data); 
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setIsLoading(false);
    }
  };

  const handleSearchBook = () => {
    const term = searchTerm.toLowerCase();
    const filtered = books.filter(book =>
      (book.titulo && book.titulo.toLowerCase().includes(term)) ||
      (book.autor && book.autor.toLowerCase().includes(term))
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
    <div className="w-screen min-h-screen overflow-auto bg-black text-white">
      <NavBar />

      <div id="busqueda" className="flex flex-col p-[2vw] w-full">
        <h1 className="text-4xl font-bold">busca tu libro:</h1>
        <input
          type="text"
          placeholder="Escribe el nombre del libro o autor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg mt-[2vh] w-full max-w-[30vw] text-black"
        />
        <button
          className="bg-[#E8BD83] text-black p-2 rounded-lg hover:bg-[#D9A76B] transition duration-300 mt-[2vh] w-[30vw]"
          onClick={handleSearchBook}
        >
          Buscar
        </button>
      </div>

      <div id="filtro" className="flex flex-col justify-center items-center p-[2vw] w-full">
        <h1 className="text-4xl font-bold w-full">filtra por:</h1>
        <div className="w-full flex items-center gap-[2vw] mt-[2vh]">
          {filtersArray.map((filter, index) => (
            <button
              key={index}
              className="bg-[#E8BD83] text-black p-2 rounded-lg hover:bg-[#D9A76B] transition duration-300 min-w-[7vw]"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div id="resultados" className="flex flex-wrap gap-4 justify-start p-[2vw]">
        {filteredBooks.length === 0 ? (
          <p className="text-white">No se encontraron libros.</p>
        ) : (
          filteredBooks.map((book, index) => (
            <BookCard 
              key={book.id || index}
              title={book.titulo}
              author={book.autor}
              img={book.portada_url || "https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize"}
              color="white"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SearchBooks;
