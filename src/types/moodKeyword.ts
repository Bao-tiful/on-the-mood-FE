
export interface MoodKeyword {
  keywords: string[];
  temp_range: [number, number];
}

export interface MoodKeywordSet {
  data: MoodKeyword[];
  getKeywordsByTemp: (temp: number) => string[];
}
