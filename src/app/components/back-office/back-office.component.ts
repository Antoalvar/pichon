import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BackOfficeWidgetFacade } from './back-office-widget.facade';
import { BoActionBarComponent } from './components/bo-action-bar/bo-action-bar.component';
import { BoMetaFieldsComponent } from './components/bo-meta-fields/bo-meta-fields.component';
import { BoBlockListComponent } from './components/bo-block-list/bo-block-list.component';
import { BoModeSelectorComponent } from './components/bo-mode-selector/bo-mode-selector.component';
import { BoPostSelectorComponent } from './components/bo-post-selector/bo-post-selector.component';
import { BoDeletePanelComponent } from './components/bo-delete-panel/bo-delete-panel.component';

/**
 * Root widget for the Back-Office feature.
 * Provides the widget-scoped {@link BackOfficeWidgetFacade} and orchestrates
 * its presentation sub-components. Contains zero business logic.
 *
 * `ViewEncapsulation.None` is intentional: all styles live in the accompanying
 * SCSS file and must reach the sub-components' host elements without attribute
 * selectors.
 */
@Component({
  selector: 'app-back-office',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [BackOfficeWidgetFacade],
  imports: [
    ReactiveFormsModule,
    BoActionBarComponent,
    BoMetaFieldsComponent,
    BoBlockListComponent,
    BoModeSelectorComponent,
    BoPostSelectorComponent,
    BoDeletePanelComponent,
  ],
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.scss',
})
export class BackOfficeComponent implements OnDestroy {
  protected readonly facade = inject(BackOfficeWidgetFacade);

  ngOnDestroy(): void {
    this.facade.destroyEditors();
  }
}



