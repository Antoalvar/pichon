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

/** Stable numeric key for an editor block. Never reused within a session. */
export type BlockId = number;

/** Mirrors the FormGroup value shape for a single content block. */
export interface ContentBlockFormValue {
  readonly id: BlockId;
  readonly type: ContentBlockType;
  readonly content: string;
}

/** Mirrors the full form's getRawValue() shape. */
export interface PostFormValue {
  readonly title: string;
  readonly abstract: string;
  readonly thumbnail_url: string;
  readonly blocks: readonly ContentBlockFormValue[];
}
