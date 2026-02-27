export type ContentBlockType = 'subtitle' | 'paragraph' | 'image' | 'caption';

export interface ContentBlockTypeOption {
  readonly value: ContentBlockType;
  readonly label: string;
  readonly icon: string;
}

export const BLOCK_TYPE_OPTIONS: readonly ContentBlockTypeOption[] = [
  { value: 'subtitle', label: 'Subtítulo', icon: 'title' },
  { value: 'paragraph', label: 'Párrafo', icon: 'notes' },
  { value: 'caption', label: 'Pie de foto', icon: 'photo_camera' },
  { value: 'image', label: 'Imagen', icon: 'image' },
] as const;
