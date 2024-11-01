import { useState, useCallback, useRef, useEffect } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Code2Icon, PlusCircle, Trash2Icon } from "lucide-react";
import { Note } from "@/infraestructure/components/notes/Notes";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import "./Styles.css";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotesStore } from "@/infraestructure/zustand/NotesStore";
import { Skeleton } from "@/infraestructure/components/skeleton/Skeleton";

const ResponsiveGridLayout = WidthProvider(Responsive);

const PrivateNotesPage = () => {
  const { notes, layouts, addNote, deleteNote, setLayouts } = useNotesStore();
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const deleteZoneRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate data loading delay
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load notes. Please try refreshing the page.");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const onLayoutChange = useCallback(
    (_currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
      setLayouts(allLayouts);
    },

    [setLayouts]
  );

  const onDragStart = useCallback(
    (_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
      setDraggingNoteId(newItem.i);
    },
    []
  );

  const onDrag = useCallback(
    (
      _layout: Layout[],
      _oldItem: Layout,
      _newItem: Layout,
      _placeholder: Layout,
      _e: MouseEvent,
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
      _layout: Layout[],
      _oldItem: Layout,
      newItem: Layout,
      _placeholder: Layout,
      _e: MouseEvent,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-10 w-32 mb-4" />
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow relative overflow-x-hidden">
        <div className="flex justify-between items-center p-4">
          <HoverCard openDelay={0}>
            <HoverCardTrigger>
              <h1 className="text-lg cursor-default font-bold">
                Private Notes
              </h1>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4 cursor-default">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Information</h4>
                  <p className="text-sm">
                    This application is designed to provide security, privacy,
                    and local storage. Your notes are stored locally on your
                    device and cannot be shared. Thank you for using my app, I
                    hope it is useful.
                  </p>
                  <div className="flex items-center pt-2">
                    <Code2Icon className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Luciano de la Rubia
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="flex items-center space-x-4">
            <Button
              onClick={addNote}
              className="flex hover:bg-primary/90 items-center space-x-2 text-white px-4 py-2 rounded"
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
                reposition and resize notes to organize your annotations. If you
                need to delete one, just drag it to the trash.
              </p>
              <Button onClick={addNote} className="hover:bg-primary/90">
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
                  isOverDeleteZone={
                    isOverDeleteZone && draggingNoteId === note.id
                  }
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
        <div className="p-4">
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
