
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  members: Participant[];
}

export type AppView = 'setup' | 'lottery' | 'grouping';
