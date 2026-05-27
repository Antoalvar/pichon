import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsletterPayload {
  email: string;
  fname: string;
}

export interface InfoEmailPayload {
  email: string;
  fname: string;
  journey_id: number;
  step_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private readonly BASE_URL = 'https://pichon-back.onrender.com';

  #http = inject(HttpClient);

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  subscribe(data: NewsletterPayload): Observable<unknown> {
    return this.#http.post(`${this.BASE_URL}/subscribe_newsletter`, data, {
      headers: this.headers,
    });
  }

  unsubscribe(email: string): Observable<unknown> {
    return this.#http.post(
      `${this.BASE_URL}/unsubscribe_newsletter`,
      { email },
      { headers: this.headers }
    );
  }

  sendInfoEmail(data: InfoEmailPayload): Observable<unknown> {
    return this.#http.post(`${this.BASE_URL}/send_info_email`, data, {
      headers: this.headers,
    });
  }
}
