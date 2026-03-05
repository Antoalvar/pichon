import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InfoEmailPayload, NewsletterPayload } from './newsletterService';

@Injectable()
export class NewsletterServiceMock {
  sendInfoEmail(_data: InfoEmailPayload): Observable<unknown> {
    return of<unknown>({});
  }

  subscribe(_data: NewsletterPayload): Observable<unknown> {
    return of<unknown>({});
  }
}
