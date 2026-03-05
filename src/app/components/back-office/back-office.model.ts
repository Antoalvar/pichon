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

/** Discriminated union of the three back-office operation modes. */
export type BackOfficeMode = 'create' | 'edit' | 'delete';

/**
 * A single content block as parsed from stored HTML,
 * without the runtime-assigned stable ID.
 */
export type ParsedBlock = Omit<ContentBlockFormValue, 'id'>;

/** Descriptor for a single mode tab in the mode selector. */
export interface BoModeOption {
  readonly value: BackOfficeMode;
  readonly label: string;
  readonly icon: string;
}

export const BO_MODE_OPTIONS: readonly BoModeOption[] = [
  { value: 'create', label: 'Crear',    icon: 'add_circle' },
  { value: 'edit',   label: 'Editar',   icon: 'edit'       },
  { value: 'delete', label: 'Eliminar', icon: 'delete'     },
] as const;

