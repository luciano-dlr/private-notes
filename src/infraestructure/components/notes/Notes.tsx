import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { GripHorizontal, GripVertical, Square } from "lucide-react";
import "./Styles.css";
import { useNotesStore } from "@/infraestructure/zustand/NotesStore";

interface NoteProps {
  id: string;
  isOverDeleteZone: boolean;
}

export const Note = ({ id, isOverDeleteZone }: NoteProps) => {
  const { notes, updateNote } = useNotesStore();
  const note = notes.find((n) => n.id === id);
  const noteRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  if (!note) return null;

  const { title, content, backgroundColor } = note;

  const handleTitleChange = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      const newTitle = e.target.textContent || "";
      updateNote(id, newTitle, content, backgroundColor);
    },
    [id, content, backgroundColor, updateNote]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNote(id, title, e.target.value, backgroundColor);
    },
    [id, title, backgroundColor, updateNote]
  );

  // Nueva función para manejar el evento de tecla presionada
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevenir el comportamiento por defecto
        if (content.trim()) {
          // Agregar un nuevo elemento de lista al contenido
          const newContent = content.trim() + "\n• "; // Agregar un punto
          updateNote(id, title, newContent, backgroundColor);
        }
      }
    },
    [content, id, title, backgroundColor, updateNote]
  );

  const handleBackgroundColorChange = (value: string) => {
    const colorMap: { [key: string]: string } = {
      green: "bg-green-300",
      yellow: "bg-yellow-300",
      blue: "bg-blue-300",
      violet: "bg-violet-300",
    };
    const newBackgroundColor = colorMap[value] || "bg-white";
    updateNote(id, title, content, newBackgroundColor);
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia("(max-width: 1024px)").matches;
      setIsMobile(isMobile);
    };

    // Set initial state
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determinar las clases según el tamaño de la pantalla
  const cardClass = !isMobile ? "drag-handle" : ""; // Clase para la tarjeta completa

  return (
    <Card
      ref={noteRef}
      className={`h-full flex flex-col transition-colors duration-200 rounded-sm z-50 drag-handle ${backgroundColor} ${
        isOverDeleteZone ? "bg-red-500" : ""
      }`}
      style={{
        padding: isMobile ? "0px" : "10px", // Elimina el padding en móvil
        margin: isMobile ? "0px" : "auto", // Elimina el margen en móvil
      }}
    >
      <CardHeader
        className={`flex flex-row items-center justify-between space-y-0 ${
          isMobile ? "pb-0 justify-start" : "pb-2"
        }`}
      >
        {isMobile && ( // Solo mostrar el div pequeño en dispositivos móviles
          <div className="drag-handle w-full flex ">
            <GripVertical width={15} />
          </div>
        )}
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          className={`text-sm font-medium outline-none cursor-text flex items-center focus:ring-0 ${
            isMobile ? "w-[50%]" : "w-[70%]"
          } hover:bg-gray-100`}
          style={{
            padding: isMobile ? "0px" : "2px", // Elimina el padding en móvil
            borderRadius: "4px",
          }}
        >
          {title}
        </h2>
        <div>
          <Select onValueChange={handleBackgroundColorChange}>
            <SelectTrigger className="border-0 shadow-none focus:ring-0">
              <Square
                width={25}
                className={`absolute z-50 ${backgroundColor} rounded-sm`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="violet">Violet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Textarea
          className="w-full h-full resize-none outline-none focus:ring-0 focus:border-blue-500"
          placeholder="Type your note here..."
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          style={{
            background: "transparent",
            border: "none",
            padding: isMobile ? "0px" : "2px", // Elimina el padding en móvil
          }}
        />
      </CardContent>
    </Card>
  );
};
