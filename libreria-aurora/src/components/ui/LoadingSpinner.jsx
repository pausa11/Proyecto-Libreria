import PropTypes from "prop-types";

/**
 * Componente de spinner para pantallas de carga
 * @param {string} size - Tamaño del spinner: "sm", "md", "lg"
 * @param {string} message - Mensaje a mostrar debajo del spinner
 * @param {string} textColor - Color del texto del mensaje
 * @param {string} spinnerColor - Color del spinner
 * @param {string} height - Altura del contenedor (ej: "25vh", "100px")
 * @param {string} bgColor - Color de fondo del contenedor (opcional)
 * @returns {JSX.Element} Componente spinner
 */
const LoadingSpinner = ({
  size = "md",
  message = "Cargando...",
  textColor = "text-gray-700",
  spinnerColor = "border-[#2B388C]",
  height = "h-[25vh]", 
  bgColor = "",
  className = ""
}) => {
  // Definir tamaños de spinner
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const spinnerSize = sizes[size] || sizes.md;
  
  return (
    <div className={`flex flex-col items-center justify-center ${height} w-full ${bgColor} ${className}`}>
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 ${spinnerColor} mb-4`}></div>
      {message && <p className={textColor}>{message}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  message: PropTypes.string,
  textColor: PropTypes.string,
  spinnerColor: PropTypes.string,
  height: PropTypes.string,
  bgColor: PropTypes.string,
  className: PropTypes.string
};

export default LoadingSpinner;
