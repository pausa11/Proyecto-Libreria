import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import BuyBookSection from "./book/addTocCartButton";

function DetalleLibro() {
    const navigate = useNavigate();
    const location = useLocation();
    const libroData = location.state?.libro;

    if (!libroData) {
        return (
        <div>
            <NavBar />
            <div className="flex justify-center items-center h-screen">
            <p className="text-gray-500 text-lg">No se encontró la información del libro.</p>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 p-6 flex justify-center items-center">
                <img
                    src={libroData.portada_url}
                    alt={`Portada del libro: ${libroData.titulo}`}
                    className="rounded-xl object-cover w-full h-auto max-h-[400px]"
                />
                </div>
                <div className="md:w-2/3 p-6 space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">{libroData.titulo}</h1>
                <p className="text-gray-700">{libroData.descripcion}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <p><strong>Autor:</strong> {libroData.author}</p>
                    <p><strong>Año de publicación:</strong> {libroData.año_publicacion}</p>
                    <p><strong>Precio:</strong> ${libroData.precio}</p>
                    <p><strong>ISBN:</strong> {libroData.isbn}</p>
                    <p><strong>Editorial:</strong> {libroData.editorial}</p>
                    <p><strong>Género:</strong> {libroData.categoria_nombre}</p>
                </div>
                <BuyBookSection
                stock={libroData.stock}
                onBuy={(quantity) => {
                    console.log(`Comprando ${quantity} libro(s)`);
                    navigate("/carrito", { state: { libro: libroData, cantidad: quantity } });
                }}
                />
                </div>
                
            </div>
            
            </div>


        </div>
        </div>
    );
}

export default DetalleLibro;
