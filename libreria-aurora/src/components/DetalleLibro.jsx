import React from "react";
import { useParams } from 'react-router-dom';
import NavBar from "./NavBar";

function DetalleLibro(){

    const { libro } = useParams();

    return (
        <div>
            <NavBar/>
            {`es libro es ${libro}`}
        </div>
    )
}

export default DetalleLibro;