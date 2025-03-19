import React from "react";

function BookCard({title, author, img}) {
    return (
        <div className="w-[15vw]  p-[1vw] flex flex-col items-center justify-between">
            <img src={img} alt={title} className="w-[80%] h-[70%] object-cover rounded-[.5vw]" />
            <p className="text-[1.5vw] font-[500] text-center">{title}</p>
            <p className="text-[1vw] font-[200]">{author}</p>
        </div>
    );
}

export default BookCard;