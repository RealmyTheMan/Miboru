export interface MediaItem {
  id: string;
  type: string;
  extension: string;
  size: number;
  title: string | null;
  src: string;
  thumbnailSrc: string | null;
  tags: string[] | null;
  createdAt: Date;
}

export interface TagItem {
  id: string;
  name: string;
  count: number;
  createdAt: Date;
}
