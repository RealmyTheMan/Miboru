export interface MediaItem {
  id: string;
  type: string;
  title: string | null;
  src: string;
  thumbnailSrc: string;
  tags: string[] | null;
  createdAt: Date;
}

export interface TagItem {
  id: string;
  name: string;
  count: number;
  createdAt: Date;
}
