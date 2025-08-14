export interface Book {
  id: string;
  name: string;
  author: string | undefined;
  cover: string | undefined;
}

export interface BookInResponse {
  author_name: string[] | undefined;
  key: string;
  cover_i: number | undefined;
  title: string;
}

export interface APIResponse {
  docs: BookInResponse[];
}
