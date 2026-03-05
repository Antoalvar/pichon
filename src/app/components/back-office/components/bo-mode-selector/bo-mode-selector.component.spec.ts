import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackOfficeMode, BO_MODE_OPTIONS } from '../../back-office.model';
import { BoModeSelectorComponent } from './bo-mode-selector.component';

describe('BoModeSelectorComponent', () => {
  let fixture: ComponentFixture<BoModeSelectorComponent>;
  let component: BoModeSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoModeSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoModeSelectorComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('options', BO_MODE_OPTIONS);
    fixture.componentRef.setInput('activeMode', 'create');
    fixture.detectChanges();
  });

  it('renders one button for each option', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.bo-mode-tab');
    expect(buttons.length).toBe(BO_MODE_OPTIONS.length);
  });

  it('adds bo-mode-tab--active only to the button matching activeMode', () => {
    fixture.componentRef.setInput('activeMode', 'edit');
    fixture.detectChanges();

    const activeButtons = fixture.nativeElement.querySelectorAll(
      '.bo-mode-tab--active'
    ) as NodeListOf<HTMLButtonElement>;
    expect(activeButtons.length).toBe(1);
    expect(activeButtons[0].textContent).toContain('Editar');
  });

  it('sets aria-selected="true" on the active tab', () => {
    fixture.componentRef.setInput('activeMode', 'edit');
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.bo-mode-tab')
    ) as HTMLButtonElement[];
    const editBtn = buttons.find((b) => b.textContent?.includes('Editar'));
    expect(editBtn?.getAttribute('aria-selected')).toBe('true');
  });

  it('sets aria-selected="false" on inactive tabs', () => {
    fixture.componentRef.setInput('activeMode', 'edit');
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.bo-mode-tab')
    ) as HTMLButtonElement[];
    const createBtn = buttons.find((b) => b.textContent?.includes('Crear'));
    expect(createBtn?.getAttribute('aria-selected')).toBe('false');
  });

  it('emits modeChange with the correct mode value when a tab is clicked', () => {
    const emitted: BackOfficeMode[] = [];
    component.modeChange.subscribe((m) => emitted.push(m));

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.bo-mode-tab')
    ) as HTMLButtonElement[];
    const deleteBtn = buttons.find((b) => b.textContent?.includes('Eliminar'));
    deleteBtn?.click();

    expect(emitted).toContain('delete');
  });

  it('emits modeChange when Enter is pressed on a tab', () => {
    const emitted: BackOfficeMode[] = [];
    component.modeChange.subscribe((m) => emitted.push(m));

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.bo-mode-tab')
    ) as HTMLButtonElement[];
    const editBtn = buttons.find((b) =>
      b.textContent?.includes('Editar')
    ) as HTMLButtonElement;

    editBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(emitted).toContain('edit');
  });
});
