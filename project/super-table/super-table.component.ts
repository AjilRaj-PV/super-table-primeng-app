import { Component, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperTableConfig, SuperTableColumn } from './super-table.types';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'super-table',
  standalone: true,
  imports: [CommonModule, Tag, FormsModule, TableModule, ButtonModule, SelectButtonModule,
     DataViewModule, InputTextModule, ContextMenuModule,
     IconFieldModule, InputIconModule, 
    ],
  providers: [MessageService],
  templateUrl: './super-table.component.html',
  styleUrls: ['./super-table.component.scss']
})
export class SuperTableComponent {

  clonedProducts: { [s: string]: any } = {};
  activeMode: any = null;
  expandedRows = {};
selectedProducts  : any[] = [];
  // Signals for reactive inputs
  public _config = signal<SuperTableConfig | undefined>(undefined);
  private _data = signal<any[]>([]);

  @Input()
  set config(v: SuperTableConfig | undefined) {
    this._config.set(v);
    if (!v) {
      // Reset transient state when config is cleared so re-init is clean
      this.activeMode = null;
      this._data.set([]);
    }
  }
  get config(): SuperTableConfig | undefined { return this._config(); }

  @Input()
  set data(v: any[]) { this._data.set(v ?? []); }
  get data(): any[] { return this._data(); }

  @Output() page = new EventEmitter<any>();
  @Output() sort = new EventEmitter<any>();
  @Output() filter = new EventEmitter<any>();
  @Output() selection = new EventEmitter<any>();

  constructor(private messageService: MessageService) { }
  ngOnInit() {
    // component init
    console.log(this._data(), '_data_data');

  }

  // UI state for the inline sort menu
  sortMenuVisible = false;
  selectedProduct!: any;

  @ViewChild('cm') cm: any;

  get sortMode(): 'single' | 'multiple' {
    return this._config()?.sorting?.mode ?? 'single';
  }


  get selectionMode(): any {
    const mode = this._config()?.selection?.mode;
    if (!mode) return null;
    if (mode === 'checkbox') return 'multiple';
    if (mode === 'radio') return 'single';
    return (mode === 'single' || mode === 'multiple') ? mode : null;
  }

  // feature getters
  get expandableEnabled(): boolean { return !!(this._config() as any)?.expand; }
  get isEditable(): boolean { return !!(this._config() as any)?.edit; }
  get editMode(): any { return this._config()?.edit?.mode; }
  get reorderColumnsEnabled(): boolean { return !!(this._config() as any)?.reorder; }
  get resizeColumnsEnabled(): boolean { return !!(this._config() as any)?.resize; }
  get contextMenuEnabled(): boolean { return !!(this._config() as any)?.contextMenu; }
  get selectionModeEnabled(): boolean { return !!(this._config() as any)?.selectionMode; }
  get filterEnabled(): boolean { return !!(this._config() as any)?.filtering?.enabled; }

  // context menu model and handlers
  get contextMenuModel() {
    if (!this.contextMenuEnabled) return [];
    return [
      { label: 'View', icon: 'pi pi-fw pi-search', command: () => this.viewProduct(this.selectedProduct) },
      { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => this.deleteProduct(this.selectedProduct) }
    ];
  }

  onContextMenuSelect(event: any) {
    this.selection.emit({ type: 'context', event });
  }

  onContextItem(action: string) {
    this.selection.emit({ type: 'context-command', action });
  }

  // Safe getters for template usage
  get columns(): SuperTableColumn[] { return this._config()?.columns ?? []; }

  // Respect both legacy (root) and new (pagination object) config shapes
  get paginatorEnabled(): boolean {
    const cfg = this._config();
    return !!(cfg?.pagination?.enabled ?? (cfg as any)?.paginator);
  }


  get rowsTemplate(): number | undefined { const cfg = this._config(); return cfg?.pagination?.rows ?? (cfg as any)?.rows; }
  get rows(): number | undefined { const cfg = this._config(); return cfg?.pagination?.rows ?? (cfg as any)?.rows; }
  get rowsPerPageOptions(): number[] | undefined { const cfg = this._config(); return cfg?.pagination?.rowsPerPageOptions ?? (cfg as any)?.rowsPerPageOptions; }
  get scrollHeight(): string | undefined { return this._config()?.scroll?.height ?? undefined; }
  get scrollable(): boolean { const s = this._config()?.scroll; return !!(s?.vertical || s?.horizontal); }

   viewProduct(product: any) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
    }

    deleteProduct(product: any) {
        this.data = this.data.filter((p) => p.id !== product.id);
        this.messageService.add({ severity: 'error', summary: 'Product Deleted', detail: product.name });
        this.selectedProduct = null;
    }

  selectMode(mode: any) {
    this.activeMode = null;      // destroy
    setTimeout(() => {
      this.activeMode = mode;    // recreate
    });
  }
  getStatusSeverity(status: string) {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
    }
    return 'info';
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(product: any) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id as string];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
  }

  onRowEditCancel(product: any, index: number) {
    this.data[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
  }

}
