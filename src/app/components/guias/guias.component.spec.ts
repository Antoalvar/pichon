import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GuiasComponent } from './guias.component';

const EXPECTED_IMAGE_URL =
  'https://ik.imagekit.io/i6kjq7mb2/Guias/PICH-post%20guia.png';
const EXPECTED_TITLE = 'Guía semana santa';
const EXPECTED_DESCRIPTION =
  'Especial Londres y recomendaciones en Amsterdam, y París más algunas sorpresas';

describe('GuiasComponent', () => {
  let component: GuiasComponent;
  let fixture: ComponentFixture<GuiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create successfully', () => {
    expect(component).toBeTruthy();
  });

  describe('guides signal', () => {
    it('should expose one guide item', () => {
      expect(component.guides().length).toBe(1);
    });

    it('should return the guide with the expected image url', () => {
      expect(component.guides()[0].image).toBe(EXPECTED_IMAGE_URL);
    });

    it('should return the guide with the expected title', () => {
      expect(component.guides()[0].title).toBe(EXPECTED_TITLE);
    });

    it('should return the guide with the expected description', () => {
      expect(component.guides()[0].description).toBe(EXPECTED_DESCRIPTION);
    });
  });

  describe('template rendering', () => {
    it('should render one guide item card', () => {
      const items = fixture.debugElement.queryAll(By.css('.guide-item-wrap'));
      expect(items.length).toBe(1);
    });

    it('should render the guide image with the correct src attribute', () => {
      const img = fixture.debugElement
        .query(By.css('img'))
        .nativeElement as HTMLImageElement;
      expect(img.getAttribute('src')).toBe(EXPECTED_IMAGE_URL);
    });

    it('should render the guide image with the guide title as alt text', () => {
      const img = fixture.debugElement
        .query(By.css('img'))
        .nativeElement as HTMLImageElement;
      expect(img.getAttribute('alt')).toBe(EXPECTED_TITLE);
    });

    it('should render the guide title inside an h2 element', () => {
      const h2 = fixture.debugElement
        .query(By.css('.title h2'))
        .nativeElement as HTMLHeadingElement;
      expect(h2.textContent?.trim()).toBe(EXPECTED_TITLE);
    });

    it('should render the guide description inside a paragraph element', () => {
      const p = fixture.debugElement
        .query(By.css('.description p'))
        .nativeElement as HTMLParagraphElement;
      expect(p.textContent?.trim()).toBe(EXPECTED_DESCRIPTION);
    });

    it('should render the download button with the "Descárgala ahora" label', () => {
      const button = fixture.debugElement
        .query(By.css('button'))
        .nativeElement as HTMLButtonElement;
      expect(button.textContent?.trim()).toBe('Descárgala ahora');
    });

    it('should render the download button with type set to "button"', () => {
      const button = fixture.debugElement
        .query(By.css('button'))
        .nativeElement as HTMLButtonElement;
      expect(button.type).toBe('button');
    });
  });
});
