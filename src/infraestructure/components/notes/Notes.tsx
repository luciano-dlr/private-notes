import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Square } from "lucide-react";
import "./Styles.css";

interface NoteProps {
  id: string;
  title: string;
  content: string;
  onUpdate: (id: string, title: string, content: string) => void;
  isOverDeleteZone: boolean;
}

export const Note = ({
  id,
  title,
  content,
  onUpdate,
  isOverDeleteZone,
}: NoteProps) => {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteContent, setNoteContent] = useState(content);
  const [backgroundColor, setBackgroundColor] = useState("bg-white"); // Estado para el color de fondo

  const handleTitleChange = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      const newTitle = e.target.textContent || "";
      setNoteTitle(newTitle);
      onUpdate(id, newTitle, noteContent);
    },
    [id, noteContent, onUpdate]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNoteContent(e.target.value);
      onUpdate(id, noteTitle, e.target.value);
    },
    [id, noteTitle, onUpdate]
  );

  const handleBackgroundColorChange = (value: string) => {
    // Mapeo de valores a clases de color
    const colorMap: { [key: string]: string } = {
      green: "bg-green-300",
      yellow: "bg-yellow-300",
      blue: "bg-blue-300",
      violet: "bg-violet-300",
    };
    setBackgroundColor(colorMap[value] || "bg-white");
  };

  return (
    <Card
      className={`h-full flex flex-col transition-colors duration-200 rounded-sm ${backgroundColor} ${
        isOverDeleteZone ? "bg-red-500" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          className="text-sm font-medium outline-none cursor-text focus:ring-0 hover:bg-gray-100 "
          style={{
            padding: "2px",
            borderRadius: "4px",
          }}
        >
          {noteTitle}
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
          value={noteContent}
          onChange={handleContentChange}
          style={{
            background: "transparent",
            border: "none",
            padding: "2px",
          }}
        />
      </CardContent>
    </Card>
  );
};
