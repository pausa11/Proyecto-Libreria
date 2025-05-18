import React from "react";
import { useLocation } from 'react-router-dom';
import NavBar from "./NavBar";

function DetalleLibro(){

    const location = useLocation();
    const libroData = location.state?.libro;

    return (
        <div>
            <NavBar/>
            {libroData && (
                <div className="flex flex-col items-center justify-center h-screen p-5">
                    <div className="flex flex-col p-5 h-full w-full border-2 border-gray-300 rounded-lg shadow-lg bg-white">
                        <h1>{libroData.titulo}</h1>
                        <p>{libroData.descripcion}</p>
                        <img src={libroData.portada_url} alt={libroData.titulo} className="w-[30%] h-[50%] object-cover rounded-[.5vw]"/>
                        <p>Autor: {libroData.author}</p>
                        <p>Año de publicación: {libroData.año_publicacion}</p>
                        <p>Precio: {libroData.precio}</p>
                        <p>ISBN: {libroData.isbn}</p>
                        <p>Editorial: {libroData.editorial}</p>
                        <p>Género: {libroData.categoria_nombre}</p>
                        <p>Sinopsis: {libroData.descripcion}</p>

                    </div>
                </div>
            )}
        </div>
    )
}

export default DetalleLibro;