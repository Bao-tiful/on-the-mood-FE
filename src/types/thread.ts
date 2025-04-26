export interface Thread {
  id: string;
  location: string;
  content: string;
  custom_temp: number;
  created_at: string;
  updated_at: string;
}

export interface ThreadsByMonth {
  [key: string]: Thread[];
}

export interface ThreadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ThreadsByMonth;
}
