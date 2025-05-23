# LoadingSpinner Component

Este componente proporciona una pantalla de carga visual y consistente para toda la aplicación.

## Uso

```jsx
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Uso básico
<LoadingSpinner />

// Con opciones personalizadas
<LoadingSpinner 
  message="Cargando datos..." 
  size="lg" 
  height="h-screen"
  textColor="text-white"
  spinnerColor="border-yellow-500"
  bgColor="bg-gray-800"
/>
```

## Propiedades

| Propiedad     | Tipo            | Valor predeterminado | Descripción                                 |
|---------------|-----------------|----------------------|---------------------------------------------|
| size          | string          | "md"                 | Tamaño del spinner: "sm", "md" o "lg"       |
| message       | string          | "Cargando..."        | Mensaje a mostrar debajo del spinner        |
| textColor     | string          | "text-gray-700"      | Color del texto (clases de Tailwind)        |
| spinnerColor  | string          | "border-[#2B388C]"   | Color del spinner (clases de Tailwind)      |
| height        | string          | "h-[25vh]"           | Altura del contenedor                       |
| bgColor       | string          | ""                   | Color de fondo (opcional)                   |
| className     | string          | ""                   | Clases adicionales para el contenedor       |

## Ejemplos de uso

### Pantalla de carga a pantalla completa
```jsx
<LoadingSpinner 
  message="Cargando libros..." 
  height="h-screen" 
  size="lg"
/>
```

### Pantalla de carga con fondo negro y texto blanco
```jsx
<LoadingSpinner 
  message="Cargando libros..." 
  height="h-screen" 
  size="lg"
  bgColor="bg-black"
  textColor="text-white"
/>
```

### Spinner pequeño para carga de elementos
```jsx
<LoadingSpinner 
  size="sm" 
  message="Actualizando..." 
  height="h-16"
/>
```
