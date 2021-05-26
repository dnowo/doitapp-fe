import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Job, JobPages} from '../_service/user.service';
import {interval, Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_service/user.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {Howl} from 'howler';
import {TokenService} from '../_service/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-50%)'}),
        animate('300ms ease-in', style({transform: 'translateY(30%)'}))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({transform: 'translateY(-50%)'}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  selectedJob: Job = null;
  jobToAdd: Job = null;
  allJobs$: Observable<Job[]>;
  allPagedJobs$: Observable<JobPages>;
  oneJob: any;
  maxPage: number;
  currentPage = 0;
  totalItems: number;
  isLogged: boolean;
  jobs: any[];


  form = new FormGroup({
    repeatable: new FormControl('', [
      Validators.required
    ]),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    deadline: new FormControl('', [
      Validators.required,
    ]),
    priority: new FormControl('', [
      Validators.required,
    ]),
  });

  // tslint:disable-next-line:new-parens
  jobAddEdit: Job = new class implements Job {
    deadline: Date;
    description: string;
    ended: boolean;
    id: number;
    repeatable: boolean;
    priority: number;
    title: string;
  };

  constructor(private userService: UserService, private tokenService: TokenService) {
    this.isLogged = !!tokenService.getToken();
  }

  ngOnInit(): void {
    this.currentPage = 0;
    this.getJobs(this.currentPage);
  }

  getJobs(page: number): void {
    this.allPagedJobs$ = this.userService.getAllJobs(this.currentPage);

    var subs = this.allPagedJobs$.subscribe(jobPaged => {
      this.maxPage = jobPaged.totalPages;
      this.currentPage = jobPaged.currentPage;
      this.totalItems = jobPaged.totalItems;
      this.jobs = jobPaged.jobs;
    });
  }

  goNextPage(): void {
    if (this.currentPage <= this.maxPage) {
      this.currentPage++;
    }
  }

  goPrevPage(): void {
    if (this.currentPage === 0) { return; }
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  addJob(): void {
    this.jobAddEdit = this.readForm();
    this.userService.addJob(this.jobAddEdit).subscribe(jobs => {
      console.log(this.jobs);
      if (this.jobs === undefined) {
        this.jobs = [];
      }
      this.jobs.push(jobs);
    });
    this.jobAddEdit = null;
    this.jobToAdd = null;
  }

  editJob(id: number): void {
    this.jobAddEdit = this.readForm();
    this.jobAddEdit.id = id;
    this.jobAddEdit.ended = false;
    this.userService.editJob(this.jobAddEdit).subscribe(edited => console.log(edited));
    this.selectedJob = null;
    this.jobAddEdit = null;
  }

  deleteJob(job: Job): void {
    this.userService.deleteJob(job).subscribe(deleted => console.log(deleted));
  }

  onSelect(j: Job): void {
    if (this.jobToAdd === null) {
      this.selectedJob = j;
      this.form.patchValue({
        repeatable: j.repeatable,
      });
    } else {
      this.jobToAdd = null;
      this.selectedJob = j;
      this.form.patchValue({
        repeatable: j.repeatable,
      });
    }
  }

  onAdd(): void {
    if (this.selectedJob === null) {
      this.form.patchValue({
        notification: false,
        priority: 0,
        deadline: null,
        description: '',
        repeatable: false,
        title: ''
      });
      this.jobToAdd = ({
        id: null,
        title: 'Type in title...',
        description: 'Description...',
        priority: 0,
        repeatable: false,
        deadline: null,
        ended: false,
      });
    } else {
      this.selectedJob = null;
      this.form.patchValue({
        notification: false,
        priority: 0,
        deadline: null,
        description: '',
        title: ''
      });
      this.jobToAdd = ({
        id: null,
        title: 'Type in title...',
        description: 'Description...',
        priority: 0,
        repeatable: false,
        deadline: null,
        ended: false,
      });
    }
  }

  readForm(): Job {
    const job: Job = new class implements Job {
      deadline: Date;
      description: string;
      ended: boolean;
      id: number;
      repeatable: boolean;
      priority: number;
      title: string;
    };
    job.title = this.form.value.title;
    job.priority = this.form.value.priority;
    job.deadline = this.form.value.deadline;
    job.description = this.form.value.description;
    job.repeatable = this.form.value.repeatable;
    return job;

  }

  finishJob(j: Job): void {
    j.ended = true;
    this.userService.editJob(j).subscribe(job => console.log(job));
    this.selectedJob = null;
    this.jobAddEdit = null;
  }

  offRepeatable(j: Job): void {
    j.repeatable = !j.repeatable;
    this.userService.editJob(j).subscribe(job => console.log(job));
    this.selectedJob = null;
    this.jobAddEdit = null;
  }

  openErrDialog(): void {

  }
}
