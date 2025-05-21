import React from "react";
import { useNavigate } from "react-router-dom";

function BookCard({book, color="black"}) {

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/${book.titulo}`, { state: { libro: book } });

    }

    return (
        <div className="w-[15vw]  p-[1vw] flex flex-col items-center justify-between" onClick={handleNavigate}>
            <img src={book.portada_url || "https://via.placeholder.com/150"} alt={book.titulo} className="w-[80%] h-[10vw] object-cover rounded-[.5vw]" />
            <p className="text-[1.5vw] font-[500] text-center" style={{color:color}}>{book.titulo}</p>
            <p className="text-[1vw] font-[200]" style={{color:color}}>{book.author}</p>
            <p className="text-[1vw] font-[200]" style={{color:color}}>año: {book.año_publicacion}</p>
            <p className="text-[1vw] font-[200]" style={{color:color}}>{book.precio}</p>
        </div>
    );
}

export default BookCard;