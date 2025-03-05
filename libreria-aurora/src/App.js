import logo from './logo.svg';

function App() {
  return (
    <div className="bg-red-100 h-screen flex flex-col items-center justify-center w-full">
      <header className="bg-gray-800 text-white w-full flex items-center justify-center h-16">
        <img src={logo} className="h-8" alt="logo" />
        <h1 className="text-2xl">Librería Aurora</h1>
      </header>


    </div>
  );
}

export default App;
