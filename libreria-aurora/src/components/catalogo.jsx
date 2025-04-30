import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import BookCard from "./home/bookCard";
import 'aos/dist/aos.css';

function Catalogo() {
  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/libros/";

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
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

      <div id="filtrados" className="w-full flex flex-col p-[2vw]">
        <h1 className="text-white font-[500] text-[3.5vw] w-full">
          Todos los libros
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
