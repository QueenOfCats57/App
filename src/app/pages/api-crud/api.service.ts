import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, timeout, map } from 'rxjs/operators';
import { ApiObject, CreateApiObject, UpdateApiObject } from '../api-crud/api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Базовый URL API
  private baseUrl = 'https://api.restful-api.dev/objects';
  
  constructor(private http: HttpClient) { }
  
  /**
   * GET: Получение всех объектов
   */
  getAllObjects(): Observable<ApiObject[]> {
    console.log('📡 GET запрос: получение всех объектов');
    return this.http.get<ApiObject[]>(this.baseUrl)
      .pipe(
        timeout(10000), // Таймаут 10 секунд
        retry(1), // Повтор при ошибке
        map(objects => {
          console.log(`Получено ${objects.length} объектов`);
          return objects;
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * GET: Получение объекта по ID
   */
  getObjectById(id: string): Observable<ApiObject> {
    console.log(`📡 GET запрос: получение объекта ${id}`);
    return this.http.get<ApiObject>(`${this.baseUrl}/${id}`)
      .pipe(
        timeout(10000),
        retry(1),
        catchError(this.handleError)
      );
  }
  
  /**
   * POST: Создание нового объекта
   */
  createObject(object: CreateApiObject): Observable<ApiObject> {
    console.log('📡 POST запрос: создание объекта', object);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<ApiObject>(this.baseUrl, object, { headers })
      .pipe(
        timeout(10000),
        map(response => {
          console.log('Объект создан:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * PUT: Полное обновление объекта
   */
  updateObject(id: string, object: UpdateApiObject): Observable<ApiObject> {
    console.log(`📡 PUT запрос: обновление объекта ${id}`, object);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.put<ApiObject>(`${this.baseUrl}/${id}`, object, { headers })
      .pipe(
        timeout(10000),
        map(response => {
          console.log('Объект обновлен:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * DELETE: Удаление объекта
   */
  deleteObject(id: string): Observable<{ message: string }> {
    console.log(`📡 DELETE запрос: удаление объекта ${id}`);
    
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
      .pipe(
        timeout(10000),
        map(response => {
          console.log('Объект удален:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * Обработка ошибок
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла ошибка при выполнении запроса';
    
    if (error.error instanceof ErrorEvent) {
      // Ошибка на клиенте
      errorMessage = `Ошибка клиента: ${error.error.message}`;
    } else {
      // Ошибка на сервере
      switch (error.status) {
        case 0:
          errorMessage = 'Нет соединения с сервером. Проверьте интернет-соединение.';
          break;
        case 400:
          errorMessage = 'Некорректный запрос. Проверьте введенные данные.';
          break;
        case 404:
          errorMessage = 'Объект не найден.';
          break;
        case 500:
          errorMessage = 'Ошибка на сервере. Попробуйте позже.';
          break;
        default:
          errorMessage = `Ошибка сервера: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Ошибка API:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}