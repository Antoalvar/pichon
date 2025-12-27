import { Component, effect, input, output, signal } from '@angular/core';
import { NgClass } from '../../../../node_modules/@angular/common/common_module.d-NEF7UaHr';

@Component({
  selector: 'app-menu-button',
  imports: [],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss',
})
export class MenuButtonComponent {
  private readonly _isOpen = signal<boolean>(false);
  readonly isOpen = this._isOpen.asReadonly();

  isButtonOpen = output<boolean>();
  changedFromOutside = input.required<boolean>();

  constructor() {
    effect(() => this._isOpen.set(this.changedFromOutside()));
  }

  changeButton() {
    this._isOpen.update((val) => !val);
    this.isButtonOpen.emit(this._isOpen());
  }
}
