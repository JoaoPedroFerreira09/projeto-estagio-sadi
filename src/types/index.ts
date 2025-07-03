export interface Image {
  id: string;
  url: string;
}

export interface Profile {
  name: string;
  items: Image[];
}