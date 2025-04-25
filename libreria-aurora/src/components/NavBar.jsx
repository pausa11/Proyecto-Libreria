import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ShoppingCart, Search , LogOut} from "lucide-react";
import logo from "../images/Logo.svg";
import AOS from 'aos';
import 'aos/dist/aos.css';

function NavBar() {

    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/usuarios/perfil/";

    useEffect(() => {
        AOS.init({
            duration: 1000,  
            easing: 'ease-in-out',  
            once: false,  
            mirror: true,
        });
    }, []);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(backendURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error en la petición");
            }

            const data = await response.json();
            console.log("Datos de usuario:", data);
            setUserName(data.username);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUserName(null);
        navigate('/');
    }

    const handlePerfil = () => {
        if (userName){
            navigate('/miPerfil')
        }else{
            navigate('/login')
        }
    }

    return (
        <nav className="h-[12vh] bg-[white] flex justify-between items-center p-[2vw] border-b-[.5vh] border-[#2B388C]" data-aos="fade-down">
            
            <div className="flex justify-center items-center h-full">
                <img src={logo} alt="logo" className="h-[8vh]" />
            </div>

            <div className="gap-[3vw] flex justify-center items-center">
                <p className="text-[#2B388C] text-[1.5vw] font-[200]" onClick={() => navigate('/')}>Inicio</p>
                <p className="text-[#2B388C] text-[1.5vw] font-[200]" onClick={() => navigate('/catalogo')}>Catálogo</p>
            </div>

            <div className="flex justify-center items-center gap-4">
                {userName && (
                    <p className="text-[#2B388C] text-[1.2vw] font-[500]">Hola, {userName.split(" ")[0]}👋</p>
                )}
                <User size={'2.5vw'} color="#2B388C" onClick={handlePerfil} />
                <ShoppingCart size={'2.5vw'} color="#2B388C" onClick={() => navigate('/cart')} />
                <Search size={'2.5vw'} color="#2B388C" onClick={() => navigate('/search')} />
                {userName && (
                    <LogOut size={'2.5vw'} color="#2B388C" onClick={() => handleLogout()}/> 
                )}
            </div>

        </nav>
    );
}

export default NavBar;
