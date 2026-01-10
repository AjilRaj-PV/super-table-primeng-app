import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SuperTableComponent, SuperTableConfig } from '../../project/super-table';
import { customers } from '../../project/super-table/sample-data';
import { ProductService } from '../../project/services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SuperTableComponent],
  providers: [ProductService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private productService: ProductService) { }
  title = 'super-table-primeng-app';

  // modes can be groups (with children) or single selectable modes
  modes: any[] = [];

  ngOnInit(): void {
    // initialize modes after DI is ready so services can be used safely
    this.modes = [
      { id: 'basic', title: 'Basic', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name' }, { field: 'company', header: 'Company' }, { field: 'country', header: 'Country' }], paginator: false, rows: 10 }, data: customers },

      {
        id: 'row-expansion', title: 'Row Expansion', config: <SuperTableConfig>{
          columns: [
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
          ], expand: true
        },
        data: [] /* loaded below via ProductService */
      },

      {
        title: 'Edit', children: [
          { id: 'edit-cell', title: 'Cell', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name' }, { field: 'company', header: 'Company' }], edit: { mode: 'cell' } }, data: customers },
          { id: 'edit-row', title: 'Row', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name' }, { field: 'company', header: 'Company' }], edit: { mode: 'row' } }, data: customers }
        ]
      },

      { id: 'resize', title: 'Column Resize', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name' }, { field: 'company', header: 'Company' }], resize: true }, data: customers },

      { id: 'reorder', title: 'Reorder', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name' }, { field: 'company', header: 'Company' }, { field: 'country', header: 'Country' }], reorder: true }, data: customers },

      {
        id: 'context-menu', title: 'Context Menu', config: <SuperTableConfig>{
          columns: [
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
          ], contextMenu: true
        },
        data: []
      },

      { id: 'pagination-basic', title: 'Pagination', config: <SuperTableConfig>{ columns: [{ field: 'id', header: 'ID' }, { field: 'name', header: 'Name' }], paginator: true, rows: 5, rowsPerPageOptions: [5, 10, 20] }, data: customers },

      {
        title: 'Sort', children: [
          { id: 'sort-single', title: 'Single Column', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name', sortable: true }, { field: 'company', header: 'Company', sortable: true }], sorting: { mode: 'single' } }, data: customers },
          { id: 'sort-multi', title: 'Multiple Columns', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name', sortable: true }, { field: 'company', header: 'Company', sortable: true }], sorting: { mode: 'multiple' } }, data: customers },
        ]
      },
      { id: 'filter-basic', title: 'Filter', config: <SuperTableConfig>{ columns: [
        { field: 'name', header: 'Name', filter: true }, 
        { field: 'company', header: 'Company', filter: true },
        { field: 'country', header: 'Country', filter: true },
        
      ], filtering: { enabled: true } }, data: customers },
      {
        title: 'Row Selection', children: [
          { id: 'row-single', title: 'Single', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name' }], selection: { mode: 'single' }, selectionMode: true }, data: customers },
          { id: 'row-multiple', title: 'Multiple', config: <SuperTableConfig>{ columns: [{ field: 'name', header: 'Name' }], selection: { mode: 'multiple' }, selectionMode: true }, data: customers }
        ]
      },

    ];

    // auto-select the first selectable mode for convenience
    const first = this.findFirstSelectableMode();
    if (first) {
      setTimeout(() => this.selectMode(first), 0);
    }

    // load row expansion data via ProductService (avoid using service during property init)
    const rowExpansionMode: any = this.modes.find(m => (m as any).id === 'row-expansion');
    const contextMenuMode: any = this.modes.find(m => (m as any).id === 'context-menu');
    console.log(contextMenuMode, 'contextMenuMode');

    if (rowExpansionMode) {
      this.productService.getProductsWithOrdersSmall().then(data => {
        rowExpansionMode.data = data;
        // If the row-expansion mode is already selected, re-select to ensure the table is recreated with data
        if (this.selectedModeId === 'row-expansion') {
          this.selectMode(rowExpansionMode);
        }
      });
    }
    if (contextMenuMode) {
      this.productService.getProductsMini().then(data => {
        console.log(data, 'data conteeeeeee');

        contextMenuMode.data = data;
        // If the context-menu mode is already selected, re-select to ensure the table is recreated with data
        if (this.selectedModeId === 'context-menu') {
          this.selectMode(contextMenuMode);
        }
      });
    }
  }

  selectedModeId?: string;


  private findFirstSelectableMode(): any {
    for (const m of this.modes) {
      if ((m as any).id) return m;
      if ((m as any).children && (m as any).children.length) return (m as any).children[0];
    }
    return undefined;
  }

  currentConfig?: SuperTableConfig;
  currentData: any[] = [];
  tableVisible = false;



  selectMode(mode: any) {
    // mark selection for UI
    this.selectedModeId = mode?.id;

    // destroy then recreate to ensure re-init
    this.tableVisible = false;

    // clear current inputs to force destroy
    this.currentConfig = undefined;
    this.currentData = [];

    setTimeout(() => {
      // assign fresh cloned objects so child gets a new reference
      const cfg = JSON.parse(JSON.stringify(mode.config || {}));
      // ensure a unique key to signal recreation
      (cfg as any).__instanceKey = `${mode.id ?? 'mode'}-${Date.now()}`;
      const data = Array.isArray(mode.data) ? JSON.parse(JSON.stringify(mode.data)) : mode.data;

      this.currentConfig = cfg;
      this.currentData = data;

      // Wait another tick to make sure the previous component was removed,
      // then show the table again to force a fresh instance.
      setTimeout(() => (this.tableVisible = true), 0);
    }, 0);
  }

  onEvent(name: string, ev: any) {
    // simple console log for demo
    // eslint-disable-next-line no-console
    console.log('[superTable event]', name, ev);
  }
}

