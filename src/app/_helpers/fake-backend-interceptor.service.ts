import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Role} from '../_models/role';
import { User} from '../_models/user';
import { EmployeeFeedback } from '../_models/employee-feedback';
const users: User[] = [
  { id: 1, username: 'admin', password: 'admin', firstName: 'Nick', lastName: 'Jonas', role: Role.Admin},
  { id: 2, username: 'John', password: 'John@123', firstName: 'John', lastName: 'Abraham', role: Role.User },
  { id: 3, username: 'Kelsey', password: 'Kelsey@123', firstName: 'Kelsey', lastName: 'Man', role: Role.User }
];
const empfeedback: EmployeeFeedback[] = [
    { empId: 1, empName: 'Nick', project: 'Banking', comments: 'Keep it going!!',rating:3,mgrRating:'',mgrComments:'',role: Role.Admin},
    { empId: 2, empName: 'John', project: 'Chubb', comments: 'Good work',rating:3, mgrRating:'',mgrComments:'',role: Role.User}
];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor{

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
        .pipe(mergeMap(handleRoute))
        .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(delay(500))
        .pipe(dematerialize());

    function handleRoute() {
        switch (true) {
            case url.endsWith('/users/authenticate') && method === 'POST':
                return authenticate();
            case url.endsWith('/users') && method === 'GET':
                return getUsers();
            case url.match(/\/users\/\d+$/) && method === 'GET':
                return getUserById();
            case url.endsWith('/users/addfeefback') && method === 'POST':
                return addEmpFeedback();
            case url.endsWith('/empfeedback') && method === 'GET':
                return getFeedbackList();
            case url.match(/\/empfeedback\/\w+$/) && method === 'DELETE':
                return deleteFeedback();
            case url.match(/\/updateEmpfeedback\/\w+$/) && method === 'PUT':
                return updateFeedback();
            case url.match(/\/empfeedback\/\d+$/) && method === 'GET':
                return getFeedbacksById();
            default:
                // pass through any requests not handled above
                return next.handle(request);
        }

    }

    // route functions

    function authenticate() {
        const { username, password } = body;
        const user = users.find(x => x.username === username && x.password === password);
        if (!user) return error('Username or password is incorrect');
        return ok({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token: `fake-jwt-token.${user.id}`
        });
    }

    function getUsers() {
        if (!isAdmin()) return unauthorized();
        return ok(users);
    }

    function getUserById() {
        if (!isLoggedIn()) return unauthorized();

        // only admins can access other user records
        if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

        const user = users.find(x => x.id === idFromUrl());
        return ok(user);
    }
    function getFeedbacksById() {
        if (!isLoggedIn()) return unauthorized();

        // only admins can access other user records
        if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();
        let urlParts = request.url.split('/');
        let id= parseInt(urlParts[urlParts.length - 1]);
 
        const feedbackList = empfeedback.find(x => x.empId === id);
        return ok(feedbackList);
    }
    function getFeedbackList() {
        return ok(empfeedback);
    }

            // addEmpFeedback user
    function addEmpFeedback(){
       
            // get new user object from post body
            let newFeedback:EmployeeFeedback = request.body;

            let duplicateUser = empfeedback.filter(empfeedback => { return empfeedback.project === newFeedback.project; }).length;
            if (duplicateUser) {
                alert("Feedback is alredy submitted for this Project")
                return throwError({ error: { message: 'Username "' + newFeedback.empId + '" is already taken' } });
            }
            // save new user
            empfeedback.push(newFeedback);
            localStorage.setItem('empfeedback', JSON.stringify(newFeedback));

            // respond 200 OK
            return of(new HttpResponse({ status: 200 }));
        
    }
    function updateFeedback(){
        let urlParts = request.url.split('/');
        let id= parseInt(urlParts[urlParts.length - 1]);
        let editedFeedback = request.body;
        empfeedback.forEach((t, i) => {  
            if (t.empId === id) {  
                empfeedback[i] = t;  
                localStorage.setItem('empfeedback', JSON.stringify(empfeedback));
            }  
        });

        // respond 200 OK
        return of(new HttpResponse({ status: 200 }));

    }
    // delete user
    function deleteFeedback(){
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        // if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            // find user by id in users array
            let urlParts = request.url.split('/');

            let id= parseInt(urlParts[urlParts.length - 1]);

            for (let i = 0; i < empfeedback.length; i++) {
                let feedback = empfeedback[i];
                if (feedback.empId=== id) {
                    // delete user
                    empfeedback.splice(i, 1);
                    localStorage.setItem('empfeedback', JSON.stringify(empfeedback));
                    break;
                }
            }

            // respond 200 OK
            return of(new HttpResponse({ status: 200 }));
         
            // return 401 not authorised if token is null or invalid
            //return throwError({ status: 401, error: { message: 'Unauthorised' } });
        
    }

    // helper functions

    function ok(body) {
        return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
        return throwError({ status: 401, error: { message: 'unauthorized' } });
    }

    function error(message) {
        return throwError({ status: 400, error: { message } });
    }

    function isLoggedIn() {
        const authHeader = headers.get('Authorization') || '';
        return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
        return isLoggedIn() && currentUser().role === Role.Admin;
    }

    function currentUser() {
        if (!isLoggedIn()) return;
        const id = parseInt(headers.get('Authorization').split('.')[1]);
        return users.find(x => x.id === id);
    }

    function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
    }
}
}
export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};