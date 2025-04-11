import React from "react";
import NavBar from "./NavBar";

function SearchBook() {
  return (
    <div className="w-screen min-h-screen overflow-auto">
      <NavBar />
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-4xl font-bold">Buscar Libros</h1>
        <p className="mt-4 text-lg">Aquí puedes buscar libros por título, autor o ISBN.</p>
      </div>
    </div>
  );
}

export default SearchBook;