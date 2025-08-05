export type TypeOfTask = {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  description: string;
};

export type InputTaskData = {
  title: string;
  dueDate: string;
  description: string;
};
