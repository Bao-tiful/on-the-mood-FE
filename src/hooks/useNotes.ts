import { useEffect, useState, useCallback } from 'react';
import { getNotes, Note } from '../api/endpoints/daily-notes';
import { NoteItem } from '@/models/NoteItem';

export function useNotes(currentDate?: Date) {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const fetchNotes = useCallback(async (targetDate?: Date) => {
    try {
      // currentDate가 있으면 해당 날짜로, 없으면 오늘 날짜로 설정
      const dateToUse = targetDate || currentDate || new Date();
      const dateString = dateToUse.toISOString().split('T')[0]; // YYYY-MM-DD 형식

      const result = await getNotes({ date: dateString });
      console.log(result);
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
      console.log(fetchedNotes);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchNotes(currentDate);
  }, [currentDate, fetchNotes]);

  return { notes, reloadNotes: fetchNotes };
}

function convertNote(note: Note): NoteItem {
  return {
    id: note.id,
    location: note.location,
    custom_temp: note.custom_temp,
    average_feels_like_temp: note.avg_feels_like_temp,
    content: note.content,
    created_at: new Date(note.created_at),
    updated_at: new Date(note.updated_at),
  };
}
