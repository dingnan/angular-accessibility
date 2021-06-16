import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';

  /**
   * Known issue
   * Tested with NVDA, for active item, the highlight color is missing, however, the speaking works. 
   */
@Component({
  selector: 'app-list-item',
  styles: [`
    :host {
      display: block;
      margin: 1rem 0;
      padding: 1rem;
      transition: all 0.3s;
      outline: none;
    }

    :host(:focus) {
      background-color: lightgray;
      cursor: pointer;
      text-decoration: underline;
    }
  `],
  host: { tabindex: '-1' },
  template: `
    <span>{{ item }}</span>
  `,
})
export class ListItemComponent implements FocusableOption {
  @Input() item?: string;
  @Output() itemSelected = new EventEmitter<any>();

  constructor(private element: ElementRef) {}

  focus(): void {
    this.element.nativeElement.focus();
  }

  selectItem() {
    this.itemSelected.emit(this.item);
  }
}

@Component({
  selector: 'app-list',
  styles: [`
    :host {
      display: block;
      max-width: 30rem;
    }
  `],
  template: `
    <ng-content></ng-content>
  `,
})
export class ListComponent implements AfterContentInit {
  @ContentChildren(ListItemComponent) items: QueryList<ListItemComponent>;
  public keyManager: FocusKeyManager<ListItemComponent>;

  @HostListener('keydown', ['$event'])
  manage(event: KeyboardEvent) {
    const { key } = event;
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      this.keyManager.onKeydown(event);
    }
    else if (key === 'Enter') {
      this.keyManager.activeItem?.selectItem();
    }
  }

  ngAfterContentInit(): void {
    this.keyManager = new FocusKeyManager(this.items).withWrap();
  }
}

@Component({
  selector: 'my-app',
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `],
  template: `
    <h1>Fruits</h1>
    <input #inputbox type='text' [value]="address" (keydown)="handleKeydown($event)"/>
    <button (click)="loadItem()">Load List</button>
    <div style="margin: 20px 0 20px 0"></div>
    <app-list *ngIf="fruits.length">
      <app-list-item (click)="handleClick(fruit)" *ngFor="let fruit of fruits" [item]="fruit" (itemSelected)="showSelected($event)">></app-list-item>
      <app-list-item (click)="clearField()" [item]="'Clear Input'" (itemSelected)="clearField()">></app-list-item>
    </app-list>
    <div><input type="text" /></div>
    <div style="padding-top: 1rem;"><button (click)="handleClick($event)">click me</button></div>
  `,
})
export class AppComponent  {
  @ViewChild('inputbox') inputBox: ElementRef;
  @ViewChild(ListComponent) addressList: ListComponent;
  address:string = '';
  fruits: Array<string> = [];

  loadItem() {
    this.fruits = [
      'Apples',
      'Bananas',
      'Cherries',
      'Dewberries',
      'Blueberries',
      'Avocados',
    ];
  }

  handleKeydown(event: KeyboardEvent) {
    const { key } = event;
    event.stopImmediatePropagation();
    if (this.addressList?.keyManager) {
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        // passing the event to key manager so we get a change fired
        this.addressList.keyManager.onKeydown(event);
      }
    }
  }

  handleClick(event: any) {
    this.showSelected(event);
  }

  showSelected(event: any) {
    this.address = event;
    this.fruits = [];
    this.inputBox.nativeElement.focus();
  }

  clearField() {
    this.showSelected('');
  }
}
