import React from "react";
import { Mail , Key } from "lucide-react";

function Input({ type, placeholder, value, onChange }) {

    const handleIcon = (type) => {
        switch (type) {
            case 'text':
                return <Mail color="#1B2459" size={'1.2vw'} />;
            case 'password':
                return <Key color="#1B2459" size={'1.2vw'} />;
            default:
                return null;
        }
    }

    return (
        <div className="w-[50%] flex items-center gap-[1vw] border-[.1vh] border-black rounded-[1vw] p-[1vw] text-[1vw] font-[200]">
            <div>
                {handleIcon(type)}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-[100%] h-[100%] outline-none bg-transparent"
            />
        </div>
    );
}

export default Input;
