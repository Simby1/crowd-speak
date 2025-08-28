export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  authorId?: string;
  createdAt?: string;
};


