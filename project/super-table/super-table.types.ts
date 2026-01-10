import { TableLazyLoadEvent } from 'primeng/table';

export interface SuperTableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  frozen?: boolean;
  width?: string;
  bodyTemplate?: 'text' | 'date' | 'status' | 'avatar';
}

export interface SuperTableConfig {
  key?: string; // used to force destroy & recreate
  /** Internal instance key used by playground to force a fresh component instance */
  __instanceKey?: string;
  columns: SuperTableColumn[];
  sizes?: { name: string; class: string }[];

  // optional feature flags
  expand?: boolean;
  reorder?: boolean;
  resize?: boolean;
  contextMenu?: boolean;
  events?: boolean;

  pagination?: {
    enabled: boolean;
    rows?: number;
    rowsPerPageOptions?: number[];
    lazy?: boolean;
  };

  sorting?: {
    mode: 'single' | 'multiple';
    defaultSort?: { field: string; order: 1 | -1 };
  };
  template?: boolean;
  filtering?: {
    enabled: boolean;
    mode?: 'row' | 'menu';
  };

  selection?: {
    mode: 'single' | 'multiple' | 'checkbox' | 'radio';
    dataKey?: string;
  };

  scroll?: {
    vertical?: boolean;
    height?: string;
    horizontal?: boolean;
  };

  edit?: {
    mode: 'cell' | 'row';
  };

  export?: {
    csv?: boolean;
  };
}