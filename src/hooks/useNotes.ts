import { useEffect, useState } from 'react';
import { getNotes, Note } from '../api/endpoints/daily-notes';
import { NoteItem } from '@/models/NoteItem';

export function useNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const fetchNotes = async () => {
    try {
      const result = await getNotes();
      result.map((note) => convertNote(note));
      // const fetchedNotes = new Map<number, NoteItem>(
      //   result.map((note): [number, NoteItem] => [
      //     new Date(note.created_at).getDate(),
      //     {
      //       id: note.id,
      //       location: note.location,
      //       custom_temp: note.custom_temp,
      //       content: note.content,
      //       created_at: new Date(note.created_at),
      //       updated_at: new Date(note.updated_at),
      //     },
      //   ])
      // );

      const fetchedNotes = result.map((note): NoteItem => convertNote(note));
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, reloadNotes: fetchNotes };
}

function convertNote(note: Note): NoteItem {
  return {
    id: note.id,
    location: note.location,
    custom_temp: note.custom_temp,
    content: note.content,
    created_at: new Date(note.created_at),
    updated_at: new Date(note.updated_at),
  };
}
