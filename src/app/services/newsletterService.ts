import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsletterPayload {
  email: string;
  fname: string;
}

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private readonly API_URL =
    'https://pichon-back.onrender.com/subscribe_newsletter';

  #http = inject(HttpClient);

  subscribe(data: NewsletterPayload): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.#http.post(this.API_URL, data, { headers });
  }
}
