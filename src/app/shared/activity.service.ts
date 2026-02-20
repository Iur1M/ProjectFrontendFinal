import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private api = 'https://localhost:7220/api/activity';

  constructor(private http: HttpClient) {}

  getMyHistory() {
    return this.http.get<any[]>(this.api);
  }
}
