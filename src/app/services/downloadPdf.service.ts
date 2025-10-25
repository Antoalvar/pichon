import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadPdf {
  #http = inject(HttpClient);

  downloadFile(): Observable<Blob> {
    return this.#http.get('../../assets/agenda/agenda.pdf', {
      responseType: 'blob',
    });
  }
}
