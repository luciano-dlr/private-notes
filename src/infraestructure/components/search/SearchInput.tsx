import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";

interface SearchInputProps {
  onDebounce: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onDebounce }) => {
  const [textValue, setTextValue] = useState("");

  // Actualiza el valor después de un pequeño retraso (debounce)
  useEffect(() => {
    const handler = setTimeout(() => onDebounce(textValue), 200);
    return () => clearTimeout(handler);
  }, [textValue, onDebounce]);

  return (
    <div className="flex items-center px-4 bg-gray-200 rounded h-12 shadow-md ">
      <input
        type="text"
        placeholder="Buscar servicio"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        className="flex-1 text-lg text-black bg-transparent border-none outline-none placeholder-gray-500"
      />
      <Search width={20} className=" text-text-dark m-2" />
    </div>
  );
};

export default SearchInput;
