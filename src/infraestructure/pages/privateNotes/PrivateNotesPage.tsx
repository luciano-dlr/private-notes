import { useState, useCallback, useRef } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { PlusCircle, Trash2Icon } from "lucide-react";
import { Note } from "@/infraestructure/components/notes/Notes";

import "./Styles.css";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface NoteItem {
  id: string;
  content: string;
  title: string;
}

const PrivateNotesPage = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({});
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const deleteZoneRef = useRef<HTMLDivElement>(null);

  console.log(notes);

  const addNote = useCallback(() => {
    const newNote = {
      id: `note-${Date.now()}`,
      content: "",
      title: "Title",
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);

    const randomWidth = Math.floor(Math.random() * 2) + 2;
    const randomHeight = Math.floor(Math.random() * 2) + 1;

    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [
        ...(prevLayouts.lg || []),
        { i: newNote.id, x: 2, y: Infinity, w: randomWidth, h: randomHeight },
      ],
    }));
  }, []);

  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, content } : note))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    setLayouts((prevLayouts) => {
      const updatedLayouts = { ...prevLayouts };
      Object.keys(updatedLayouts).forEach((breakpoint) => {
        if (updatedLayouts[breakpoint]) {
          updatedLayouts[breakpoint] = updatedLayouts[breakpoint].filter(
            (item) => item.i !== id
          );
        }
      });
      return updatedLayouts;
    });
  }, []);

  const onLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
      setLayouts(allLayouts);
    },
    []
  );

  const onDragStart = useCallback(
    (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement
    ) => {
      setDraggingNoteId(newItem.i);
    },
    []
  );

  const onDrag = useCallback(
    (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement
    ) => {
      if (deleteZoneRef.current) {
        const deleteZoneRect = deleteZoneRef.current.getBoundingClientRect();
        const noteRect = element.getBoundingClientRect();
        const isIntersecting =
          noteRect.left < deleteZoneRect.right &&
          noteRect.right > deleteZoneRect.left &&
          noteRect.top < deleteZoneRect.bottom &&
          noteRect.bottom > deleteZoneRect.top;
        setIsOverDeleteZone(isIntersecting);
      }
    },
    []
  );

  const onDragStop = useCallback(
    (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement
    ) => {
      setDraggingNoteId(null);
      setIsOverDeleteZone(false);
      if (deleteZoneRef.current) {
        const deleteZoneRect = deleteZoneRef.current.getBoundingClientRect();
        const noteRect = element.getBoundingClientRect();
        if (
          noteRect.left < deleteZoneRect.right &&
          noteRect.right > deleteZoneRect.left &&
          noteRect.top < deleteZoneRect.bottom &&
          noteRect.bottom > deleteZoneRect.top
        ) {
          deleteNote(newItem.i);
        }
      }
    },
    [deleteNote]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow relative overflow-x-hidden">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-lg font-bold">Private Notes</h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={addNote}
              className="flex  hover:bg-primary/90 items-center space-x-2 text-white px-4 py-2 rounded"
            >
              <PlusCircle size={20} />
              <span>Add Note</span>
            </Button>
          </div>
        </div>
        <Separator className="" />
        {notes.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center relative">
            <div className="text-center space-y-4 relative z-10">
              <h2 className="text-2xl font-semibold">
                Welcome to Private Notes
              </h2>
              <p className="text-muted-foreground max-w-md">
                Create your first note by clicking the button. Drag to
                reposition and resize notes to organize your thoughts. If you
                need to delete one, just drag it to the trash.
              </p>
              <Button onClick={addNote} className=" hover:bg-primary/90">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            </div>
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout flex"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 10, md: 7, sm: 6, xs: 4, xxs: 2 }}
            // rowHeight={30}

            // rowHeight={30}
            onLayoutChange={onLayoutChange}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragStop={onDragStop}
          >
            {notes.map((note) => (
              <div
                key={note.id}
                className={draggingNoteId === note.id ? "dragging" : ""}
                style={{ backgroundColor: "transparent" }}
              >
                <Note
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  onUpdate={updateNote}
                  isOverDeleteZone={
                    isOverDeleteZone && draggingNoteId === note.id
                  }
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
        <div className="  p-4">
          <div className="flex items-center">
            <div
              ref={deleteZoneRef}
              className="trash-icon-container right-0 p-1.5 rounded bg-red-500 flex items-center justify-end text-white"
            >
              <Trash2Icon size={24} />
            </div>
          </div>
        </div>
      </div>

      <Separator className="" />

      <footer className="p-1">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Private Notes Application - Luciano
          de la Rubia
        </p>
      </footer>
    </div>
  );
};

export default PrivateNotesPage;
