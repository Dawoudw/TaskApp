import {Component, HostListener, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {AuthorizationService} from '../../services/authorization.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {MatDialog} from '@angular/material/dialog';
import {VersionComponent} from '../dialog/version/version.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{


  time = new Date();
  timer;
  user: string = ''; // username
  loggedIn: boolean; // log in button
  version = '1.2.1';
  allowAccess : boolean;

  Stoday: boolean = true;
  Screate: boolean = false;
  Sname: boolean = false;
  Sdate: boolean = false;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private auth: AuthorizationService,
              private router: Router,
              private data: DataService,
              public dialog: MatDialog) {
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('back button pressed')
    this.logout2()
  }

  ngOnInit() {
    this.timer = setInterval(() => {this.time = new Date();}, 1000);
    this.auth.sharedUser.subscribe(user => this.user = user);
    this.auth.sharedLoggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
    console.log(this.router.url)

    if (this.auth.isLoggedIn()){
      this.loggedIn = true;
      this.user = localStorage.getItem('UserEmail');
    }


    this.data.sharedToday.subscribe(Stoday => this.Stoday = Stoday);
    this.data.sharedCreate.subscribe(Screate => this.Screate = Screate);
    this.data.sharedDate.subscribe(Sdate => this.Sdate = Sdate);
    this.data.sharedName.subscribe(Sname => this.Sname = Sname);
  }


  logout2(){
    this.auth.logOut();
    localStorage.clear();
    this.user = '';
    this.loggedIn = false;
    this.auth.sendState(this.loggedIn);
    this.router.navigateByUrl('');
    this.allowAccess = false;
  }

  showToday(){
    this.data.sendToday(true);
    this.data.sendCreate(false);
    this.data.sendDate(false);
    this.data.sendName(false);
    console.log(this.Stoday)
  }

  showName(){
    this.data.sendToday(false);
    this.data.sendCreate(false);
    this.data.sendDate(false);
    this.data.sendName(true);
    console.log(this.Stoday)
  }

  showDate(){
    this.data.sendToday(false);
    this.data.sendCreate(false);
    this.data.sendDate(true);
    this.data.sendName(false);
    console.log(this.Stoday)
  }

  showCreate(){
    this.data.sendToday(false);
    this.data.sendCreate(true);
    this.data.sendDate(false);
    this.data.sendName(false);
    console.log(this.Stoday)
  }

  openNotes(){
    let dialogRef = this.dialog.open(VersionComponent, {
      data: {
        version: this.version
      }, height: '550px'
    });

  }

  changePassword(){
    //fill with change pass logic
  }



  ngOnDestroy(){
    clearInterval(this.timer);
  }

}





