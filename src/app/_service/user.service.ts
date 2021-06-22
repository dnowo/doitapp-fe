import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

const API = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private jobSubject = new BehaviorSubject<Job[]>([]);
  jobObservable$ = this.jobSubject.asObservable();

  private jobPageSubject = new BehaviorSubject<JobPages>({});
  jobPageObservable$ = this.jobPageSubject.asObservable();
  jobsCurrentPage = 0;
  jobsTotalItems;
  jobsTotalPages;
  jobsPaged = [];
  jobs = [];
  jobsUnsorted = [];

  constructor(private http: HttpClient) {
    this.jobsCurrentPage = 0;
  }

  getAllJobs(page: number): Observable<JobPages> {
    if (page === undefined) {
      page = 0;
    }

    this.http.get<JobPages>(API + 'api/job/all' + '?page=' + page).subscribe(j => {
      if (j.jobs.length > 0){
        this.jobs = j.jobs;
        this.jobsPaged = j.jobs;
        this.jobPageSubject.next(j);
        this.jobsCurrentPage = j.currentPage;
        this.jobsTotalItems = j.totalItems;
        this.jobsTotalPages = j.totalPages;
      }
      console.log(j);
    }, error => {
      console.log(error);
    });

    return this.jobPageObservable$;
  }

  public addJob(job: Job): Observable<Job> {
    // @ts-ignore
    job.deadline = this.convert(job.deadline);
    // this.jobs.push(job);
    this.jobSubject.next(this.jobs);

    return this.http.post<Job>(API + 'api/job/add', job);
  }

  public deleteJob(job: Job): Observable<Job> {
    const index: number = this.jobs.indexOf(job);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
    this.jobSubject.next(this.jobs);
    return this.http.delete<Job>(API + 'api/job/delete/' + job.id);
  }

  public editJob(job: Job): Observable<Job> {
    const find: Job = this.jobs.find(x => x.id === job.id);
    const index: number = this.jobs.indexOf(find);

    // @ts-ignore
    job.deadline = this.convert(job.deadline);
    console.log(job.deadline);
    if (index !== -1) {
      this.jobs[index].title = job.title;
      this.jobs[index].description = job.description;
      this.jobs[index].deadline = job.deadline;
      this.jobs[index].repeatable = job.repeatable;
      this.jobs[index].priority = job.priority;
      this.jobs[index].ended = job.ended;
      this.jobSubject.next(this.jobs);
    }
    return this.http.put<Job>(API + 'api/job/edit', job );
  }

  public getAllJobsUnsorted(): void {
    this.http.get<Job[]>(API + 'api/job/unsorted').subscribe(j => {
      this.jobsUnsorted = j;
    });
  }

  public convert(str): string {
    const date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2),
      hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
      const mins = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    const secs = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    return [date.getFullYear(), mnth, day].join('-') + 'T' + [hour, mins, secs].join(':');
  }

  public getUserData(): Observable<User> {
    return this.http
      .get<User>(API + 'api/user');
  }

}

export interface Job {
  id: number;
  priority: number;
  title: string;
  description: string;
  deadline: Date;
  repeatable: boolean;
  ended: boolean;
}

export interface JobPages {
  jobs?: any;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface User {
  email: string;
  username: string;
}

