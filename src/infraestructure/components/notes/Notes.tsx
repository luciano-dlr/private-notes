import { useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Square } from "lucide-react";
import "./Styles.css";
import { useNotesStore } from "@/infraestructure/zustand/NotesStore";

interface NoteProps {
  id: string;
  isOverDeleteZone: boolean;
}

export const Note = ({ id, isOverDeleteZone }: NoteProps) => {
  const { notes, updateNote } = useNotesStore();
  const note = notes.find((n) => n.id === id);

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

  return (
    <Card
      className={`drag-handle h-full flex flex-col transition-colors duration-200 rounded-sm z-50 ${backgroundColor} ${
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
          {title}
        </h2>
        <div className="drag-handle bg-black w-20">. . .</div>
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
