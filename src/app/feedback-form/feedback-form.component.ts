import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication-service.service';
import { EmployeeFeedback } from '../_models/employee-feedback';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit {
  feedbackForm: FormGroup;
  loading = false;
  submitted = false;
  currentUser: User;
  userFromApi: User;
  @Input() id;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService, private authenticationService: AuthenticationService)
     {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      empId: ['', Validators.required],
      empName: ['', Validators.required],
      project: ['', Validators.required],
      emp_rating: ['', Validators.required],
      comments: ['', [Validators.required]]
  });

  this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
    this.userFromApi = user;

});

  }

  // convenience getter for easy access to form fields
  get f() { return this.feedbackForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.feedbackForm.invalid) {
      return;
    }

    this.loading = true;
    let num:number;
    num=this.userFromApi.id;
    let formValue=this.feedbackForm.value;
    let fd = { empId: formValue.empId, empName: formValue.empName, project: formValue.project,
      rating: formValue.emp_rating,comments: formValue.comments,mgrRating:'',mgrComments:'' };

    this.userService.addFeedback(fd, num)
      .pipe(first())
      .subscribe(
        data => {
          
          this.router.navigate(['/emp-feedback']);
          this.feedbackForm.reset();
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.submitted = false;
        });
  }
  cancel() {
    this.feedbackForm.reset();
  }

}
