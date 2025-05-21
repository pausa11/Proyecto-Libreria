import React from "react";

function Carrito() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Carrito de Compras</h1>
        <p className="text-lg">Tu carrito está vacío.</p>
        <p className="text-lg">¡Agrega libros para comenzar a comprar!</p>
        </div>
    );
    }
    
export default Carrito;