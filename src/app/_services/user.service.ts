import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { EmployeeFeedback } from '../_models/employee-feedback';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
}

getById(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
}
addFeedback(data: EmployeeFeedback,id) {
  return this.http.post(`${environment.apiUrl}/users/addfeefback`, data,id);
}
getAllFeedback(){
  return this.http.get<EmployeeFeedback[]>(`${environment.apiUrl}/empfeedback`);
}
delete(emp_id: number) {
  return this.http.delete(`${environment.apiUrl}/empfeedback/${emp_id}` );
}
update(f: EmployeeFeedback,emp_id) {
  return this.http.put(`${environment.apiUrl}/updateEmpfeedback/${emp_id}`, f, emp_id);
}
}
