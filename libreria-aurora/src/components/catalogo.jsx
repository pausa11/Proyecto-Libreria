import React from "react";
import NavBar from "./NavBar";
import BookCard from "./home/bookCard";
import { useState, useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos';

function Catalogo() {

    const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/libros/";

    const [books, setBooks] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    const [recentBooks, setRecentBooks] = useState([]);
    const [threeRandomBooks, setThreeRandomBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);   

    // Fetch books from backend
    const fetchBooks = async () => {
        try {
            const response = await fetch(backendURL);
            if (!response.ok) {
                throw new Error("Error en la petición");
            }
            const data = await response.json();
            setBooks(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching books:", error);
            setIsLoading(false);
        }
    };
    
    // Helper function to get random books
    const getRandomBooks = (sourceBooks, count) => {
        if (!sourceBooks.length) return [];

        const uniqueBooks = new Set();
        const randomBooks = [];

        while (randomBooks.length < count && uniqueBooks.size < sourceBooks.length) {
            const randomIndex = Math.floor(Math.random() * sourceBooks.length);
            const book = sourceBooks[randomIndex];
            
            if (!uniqueBooks.has(book)) {
                uniqueBooks.add(book);
                randomBooks.push(book);
            }
        }

        return randomBooks;
    };
    
    // Fetch books on component mount
    useEffect(() => {
        fetchBooks();
    }, []);
    
    // Update book selections when books change
    useEffect(() => {
        if (books.length) {
            setPopularBooks(getRandomBooks(books, 5));
            setRecentBooks(getRandomBooks(books, 5));
            setThreeRandomBooks(getRandomBooks(books, 3));

            // Refresh AOS after a short delay
            const timer = setTimeout(() => {
            AOS.refresh();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [books]);
    
    // If no books are loaded, show a loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
            Cargando libros...
            </div>
        );
    }

    const filtersArray = ['Genero','Año','Autor','Editorial','Precio'];

    return (
        <div className="w-screen h-screen overflow-auto bg-black">
            <NavBar />
            <div id="filtro" className="flex flex-col justify-center items-center p-[2vw] w-full">
                <h1 className="text-4xl font-bold text-white text-start w-full">filtra por:</h1>
                <div className="w-full flex items-center gap-[2vw] mt-[2vh]">
                    {filtersArray.map((filter, index) => (
                        <button key={index} className="bg-[#E8BD83] text-black p-2 rounded-lg hover:bg-[#D9A76B] transition duration-300 min-w-[7vw]">{filter}</button>
                    ))}
                </div>
            </div>

            <div id="populares" className="w-full p-[2vw] ">
                <h1 className="text-white font-[500] text-[3.5vw]">Popular</h1>
                <div className="w-full flex justify-center items-center gap-[2vw] mt-[2vh]">
                {
                    popularBooks.map((book, index) => (
                        <BookCard
                            key={book.id || index}
                            title={book.titulo}
                            author={book.autor}
                            img={book.portada_url || "https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize"}
                            color="white"
                        />
                    ))
                }
                </div>
            </div>

            <div id="recent" className="w-full p-[2vw] ">
                <h1 className="text-white font-[500] text-[3.5vw]">Recent</h1>
                <div className="w-full flex justify-center items-center gap-[2vw] mt-[2vh]">
                {
                    recentBooks.map((book, index) => (
                        <BookCard
                            key={book.id || index}
                            title={book.titulo}
                            author={book.autor}
                            img={book.portada_url || "https://www.hola.com/horizon/landscape/e48159e847bc-cristiano-ronaldo.jpg?im=Resize=(960),type=downsize"}
                            color="white"
                        />
                    ))
                }
                </div>
            </div>
        </div>
    );
}

export default Catalogo;