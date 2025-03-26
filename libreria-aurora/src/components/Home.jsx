import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import ButtonA from "./ui/buttonA";
import BookCard from "./home/bookCard";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [threeRandomBooks, setThreeRandomBooks] = useState([]);

  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/libros/";

  // Función para obtener los libros del backend con manejo de errores.
  const fetchBooks = async () => {
    try {
      const response = await fetch(backendURL);
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Función auxiliar para seleccionar 'count' libros aleatorios.
  const getRandomBooks = (sourceBooks, count) => {
    if (!sourceBooks.length) return [];
    return Array.from({ length: count }, () => {
      const randomIndex = Math.floor(Math.random() * sourceBooks.length);
      return sourceBooks[randomIndex];
    });
  };

  // Se obtienen los libros al montar el componente.
  useEffect(() => {
    fetchBooks();
  }, []);

  // Cuando cambian los libros, se actualizan las selecciones aleatorias.
  useEffect(() => {
    if (books.length) {
      setPopularBooks(getRandomBooks(books, 5));
      setRecentBooks(getRandomBooks(books, 5));
      setThreeRandomBooks(getRandomBooks(books, 3));
    }
  }, [books]);

  return (
    <div id="home" className="w-full h-screen overflow-auto">
      <NavBar />

      <div id="tiendas" className="bg-[#1B2459] w-full h-[50%] p-[2vw]">
        <div className="relative w-full h-full flex">
          <div className="absolute bottom-0 right-0 flex justify-end items-center w-full h-[10%]">
            <ButtonA text="Tiendas" onClick={() => {}} width="10%" color="#FFD700" />
          </div>
        </div>
      </div>

      <div id="populares" className="w-full p-[2vw]">
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          <p className="text-[2vw] font-medium text-center h-[10%] flex items-center">
            Populares
          </p>
          <div className="w-full flex justify-center">
            {popularBooks.map((book, index) => (
              <BookCard
                key={index}
                title={book.titulo}
                author={book.autor}
                img={
                  book.portada ??
                  "https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize"
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div id="catalogo" className="bg-[#5E5E51] w-full p-[2vw]">
        <div className="relative w-1/2 flex flex-col justify-evenly items-center">
          <p className="text-white text-[4vw] text-center">
            VISITA NUESTRO CATALOGO
          </p>
          <ButtonA text="ver más" onClick={() => {}} width="20%" color="#FFD700" />
        </div>
      </div>

      <div id="tres-aleatorios" className="flex flex-col w-full p-[10vw] gap-10 bg-white">
        {threeRandomBooks.length > 0 &&
          [0, 1, 2].map((_, index) => (
            <div key={index} className="h-[40vh] w-full flex flex-row justify-evenly">
              {index % 2 === 0 ? (
                <>
                  <div className="w-[30%] h-full bg-[#E8BD83] rounded-lg">
                    <img src="https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize" alt="portada del libro" className="w-full h-full" />
                  </div>
                  <div className="flex flex-col justify-start items-start w-[50%] h-[80%]">
                    <h1 className="font-medium text-4xl">
                      {threeRandomBooks[index].titulo}
                    </h1>
                    <h2 className="text-lg">
                      Descripción sobre sus libros populares y datos curiosos
                    </h2>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-start items-start w-[50%] h-[80%]">
                    <h1 className="font-medium text-4xl">
                      {threeRandomBooks[index].titulo}
                    </h1>
                    <h2 className="text-lg">
                      Descripción sobre sus libros populares y datos curiosos
                    </h2>
                  </div>
                  <div className="w-[30%] h-full bg-[#E8BD83] rounded-lg">
                    <img src="https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize" alt="portada del libro" className="w-full h-full" />
                  </div>
                </>
              )}
            </div>
          ))}
      </div>

      <div id="populares" className="w-full p-[2vw]">
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          <p className="text-[2vw] font-medium text-center h-[10%] flex items-center">
            Recién Agregados
          </p>
          <div className="w-full flex justify-center">
            {recentBooks.map((book, index) => (
              <BookCard
                key={index}
                title={book.titulo}
                author={book.autor}
                img={
                  book.portada ??
                  "https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
