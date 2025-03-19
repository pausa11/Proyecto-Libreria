import React from "react";
import {useNavigate} from 'react-router-dom';
import { User, ShoppingCart,Search } from 'lucide-react';
import logo from '../images/Logo.svg';

function NavBar(){

    const navigate = useNavigate();

    return(
        <nav id="navBar" className="h-[12vh] bg-[white] flex justify-between items-center p-[2vw] border-b-[.5vh] border-[#2B388C] ">
            <div id='logo' className="flex justify-center items-center h-full">
                <img src={logo} alt="logo" className="h-[8vh]"/>
            </div>

            <div id='menu' className="gap-[3vw] flex justify-center items-center">
                <a className="text-[#2B388C] text-[1.5vw] font-[200]" onClick={() => navigate('/')}>Inicio</a>
                <a className="text-[#2B388C] text-[1.5vw] font-[200]" onClick={() => navigate('/catalogo')}>Catalogo</a>
            </div>

            <div id='options' className="flex justify-center items-center gap-4">
                <User size={'2.5vw'} color="#2B388C" onClick={() => navigate('/login')} />
                <ShoppingCart size={'2.5vw'} color="#2B388C" onClick={() => navigate('/cart')} />
                <Search size={'2.5vw'} color="#2B388C" onClick={() => navigate('/search')} />
            </div>
        </nav>
    );
}

export default NavBar;