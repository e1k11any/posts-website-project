import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/auth';

  private currentUser = new BehaviorSubject<User | null>(this.getUser());
  currentUser$: Observable<User | null> = this.currentUser.asObservable();

  // A BehaviorSubject holds the current login state. false means logged out.
  // The '$' is a convention for observables.
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Expose the login state as a read-only observable
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  // Check if a token exists in localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap((user) => {
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('currentUser', JSON.stringify(user)); // Store user data
        this.loggedIn.next(true);
        this.currentUser.next(user); // Update current user
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser'); // Clear user data
    this.loggedIn.next(false);
    this.currentUser.next(null); // Update current user
  }

  private getUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
