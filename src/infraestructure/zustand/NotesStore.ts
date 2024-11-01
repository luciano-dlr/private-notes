import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Layout } from "react-grid-layout";

export interface NoteItem {
  id: string;
  content: string;
  title: string;
  backgroundColor: string;
}

interface NotesState {
  notes: NoteItem[];
  layouts: { [key: string]: Layout[] };
  addNote: () => void;
  updateNote: (
    id: string,
    title: string,
    content: string,
    backgroundColor: string
  ) => void;
  deleteNote: (id: string) => void;
  setLayouts: (layouts: { [key: string]: Layout[] }) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      layouts: {},
      addNote: () =>
        set((state) => {
          const newNote = {
            id: `note-${Date.now()}`,
            content: "",
            title: "Title",
            backgroundColor: "bg-white",
          };
          const randomWidth = Math.floor(Math.random() * 2) + 2;
          const randomHeight = Math.floor(Math.random() * 2) + 1;
          const newLayout = {
            i: newNote.id,
            x: 2,
            y: Infinity,
            w: randomWidth,
            h: randomHeight,
          };
          return {
            notes: [...state.notes, newNote],
            layouts: {
              ...state.layouts,
              lg: [...(state.layouts.lg || []), newLayout],
            },
          };
        }),
      updateNote: (id, title, content, backgroundColor) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, title, content, backgroundColor } : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          layouts: Object.fromEntries(
            Object.entries(state.layouts).map(([breakpoint, layout]) => [
              breakpoint,
              layout.filter((item) => item.i !== id),
            ])
          ),
        })),
      setLayouts: (layouts) => set({ layouts }),
    }),
    {
      name: "notes-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
