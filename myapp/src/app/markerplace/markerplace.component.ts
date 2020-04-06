import { Component, OnInit ,HostListener} from '@angular/core';
import { switchMap, distinctUntilChanged, debounceTime, startWith } from 'rxjs/operators';
import { ViewChild, Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'

import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { tap,finalize } from 'rxjs/operators';

declare var $: any;
import { environment } from './../../environments/environment';
@Component({
  selector: 'app-markerplace',
  templateUrl: './markerplace.component.html',
  styleUrls: ['./markerplace.component.scss']
})
export class MarkerplaceComponent implements OnInit {

  headers: Headers = new Headers();

  origin = ''; ///origin ip
  destination = ''; //destinatiopn ip
  Origin = '';
  Destination = '';
  displayedColumns: string[] = ['currency'];
  allMarketData: any[] = [];
  @ViewChild('successErrorModal') successErrorModal: any;
  @ViewChild('market') dataTableComponent: any;

  incomingbookings = []; // table dataFormat1

  selctedsortby;

  //drop down table data
  originData=[];
  addServices=[];


  first = 0; // to initialize table paginator to first

  results: any; //for autocomplte in model
  Toporigin: any = '';


  resultsDisplay = 0;
  topDestination: any = '';
  topDestinationResultsDisplay;
  dResults;

  datasource;
  loading: boolean;
  totalRecords: number;
  OfferId;
  bookingData: any[] = [];
  // top filters
  ServiceTypeModel: any = '';
  AllInclusiveModel;
  ratingsModel: any = '';
  serviceType = [];
  anyBooleanPropertyFromComponent = true;
  closeBtnWhenLastTabClosed = false; // model close button


  typeOfUser: {};
  userId: number;
  customerId: number;
  permissionStatus: string;
  createBooking = false;

  sotybyETD = 'asc';
  sortbyETA = 'asc';
  sortbyFRC = 'asc';

  ready =false;
  modeOfTransportation='Air';
  sliderValue = 0; // range modal
  // search panel
  searchScreen =true;
  afterSearch= false;
  filterDataresults = false;
  searchDataresults = true;

  OriginPort ="GOI";
  DestinationPort="JFK";
  profileForm = new FormGroup({
    Mode : new FormControl('',Validators.required),
    searchMoviesCtrl: new FormControl('',Validators.required),
    searchMoviesCtrlDest: new FormControl('',Validators.required),
  });

  filteredUsers10: Observable<any[]>;
  filteredUsers: Observable<any>;
  searchCtrl10 = new FormControl();
  searchCtrl = new FormControl();

  icon: boolean = false;
  totalData=[];
  
  filteredMovies: any;
  filteredMovies1: any;

  originPlaceHolder ="Origin";
  destPlaceHolder= "Destination";

  datepickerCloseOnSelect:boolean=true;
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    console.log(event.target.offsetHeight)
      // visible height + pixel scrolled >= total height 
      
      if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
        if(this.totalData.length != this.datasource.length)
        {
          var newData=[];
          var length = parseInt(this.datasource.length+1)+10;
          newData=this.totalData.slice(this.datasource.length, length);
          console.log(newData);
          for(var i=0;i<newData.length;i++){
            newData[i]['OfferOriginCharges']=[];
            newData[i]['OfferDestinationCharges']=[];
            newData[i]['offerAdditionalServiceOrigin']=[];
            newData[i]['offerAdditionalServiceDestination']=[];
        
            this.datasource.push(newData[i])
          }
         
        }
      }
  }

  constructor(private fb: FormBuilder, private http: HttpClient,
    private router: Router) {

      this.filteredUsers = this.searchCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '');
        }));

      this.filteredUsers10 = this.searchCtrl10.valueChanges.pipe(
        startWith(),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '');
        }));

        this.profileForm.controls['searchMoviesCtrl'].valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          
          this.filteredMovies = [];
          
        }),
        switchMap(value => this.http.get(environment.HOST_API+environment.BASE_API+'airport/filter/'+ value)
          .pipe(
            finalize(() => {
             
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredMovies=data;
      });

      this.profileForm.controls['searchMoviesCtrlDest'].valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          
          this.filteredMovies1 = [];
          
        }),
        switchMap(value => this.http.get(environment.HOST_API+environment.BASE_API+'airport/filter/'+ value)
          .pipe(
            finalize(() => {
             
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredMovies1=data;
      });

  }

  ngOnInit() {
 
    $(document).click(function(){
        try{
          // if(document.getElementById("myDropdown").classList.contains('show')){
          //   document.getElementById("myDropdown").classList.toggle("show")	
          // }
          if(document.getElementById("cuoffdrop").classList.contains('show')){
            document.getElementById("cuoffdrop").classList.toggle("show")	
          }
          if(document.getElementById("etddrop").classList.contains('show')){
            document.getElementById("etddrop").classList.toggle("show")	
          }
          if(document.getElementById("etadrop").classList.contains('show')){
            document.getElementById("etadrop").classList.toggle("show")	
          }
        }
        catch(error){console.log(error)}
      });
    
    $(".dropdown").click(function(e){
        e.stopPropagation();
    });    
 
    this.loading = true;
    
    this.http.get<any>(environment.HOST_API+environment.BASE_API+'offers/getAllMarketPlaceOffers')
    .subscribe(data=> {
        console.log(data);
        this.totalData = data.data;
        this.datasource = data.data.slice(0, 10);
        
        for(var i=0;i<this.datasource.length;i++)
        {
          this.datasource[i]['OfferOriginCharges']=[];
          this.datasource[i]['OfferDestinationCharges']=[];
          this.datasource[i]['offerAdditionalServiceOrigin']=[];
          this.datasource[i]['offerAdditionalServiceDestination']=[];
        }
        this.incomingbookings=this.datasource;
    });
  }


  // to get the star value
  getvalue(value) {
    const div5 = value / 5;
    const div100 = div5 * 100;
    return div100;
  }
  changePage(id, number) {
    // console.log(id, number);
  }

  search(){

    console.log((this.profileForm as FormGroup).get('searchMoviesCtrl').value);
    this.searchDataresults= false;
    $('.searchdiv').css('width','20%');
    $('.searchdiv').css('height','40px');
    $('.searchdiv').addClass('afrerSearch_state');

    let vm = this;
    setTimeout(function(){
      
      vm.OriginPort = vm.profileForm.get('searchMoviesCtrl').value;
      vm.DestinationPort = vm.profileForm.get('searchMoviesCtrlDest').value;
      vm.searchScreen = false;
      vm.afterSearch = true;
      $('h2.list_title').css('margin-top','70px');
    }, 1000);
    
    var dataString= {
      "Origin": (this.profileForm as FormGroup).get('searchMoviesCtrl').value,
      "Destination" : (this.profileForm as FormGroup).get('searchMoviesCtrlDest').value,
      "Ratings" : "",
      "Mode" : vm.profileForm.get('Mode').value
    }
    
    this.http.post<any>(environment.HOST_API+environment.BASE_API+'offers/filter',dataString)
    .subscribe(data=> {
      console.log(data);
      this.totalData=[];
      this.datasource=[];
      this.totalData = data.data;
      this.datasource = data.data.slice(0, 10);
      
      for(var i=0;i<this.datasource.length;i++)
      {
        this.datasource[i]['OfferOriginCharges']=[];
        this.datasource[i]['OfferDestinationCharges']=[];
        this.datasource[i]['offerAdditionalServiceOrigin']=[];
        this.datasource[i]['offerAdditionalServiceDestination']=[];
      }
      this.incomingbookings=this.datasource;
      this.filterDataresults=true;
    })
   

  }

  defaultSearch(){
    $('.searchdiv').css('width','70%');
    $('.searchdiv').css('height','130px');
    $('.searchdiv').removeClass('afrerSearch_state');
    let vm = this;
    setTimeout(function(){
      
      vm.searchScreen = true;
      vm.afterSearch = false;
      $('h2.list_title').css('margin-top','');
    }, 750);
  }
  click(){
    this.icon = !this.icon;
  }
  panelOpenState: boolean = false;

  togglePanel() {
      this.panelOpenState = !this.panelOpenState
  }
  getTheDetails(id,index){
    console.log(id+''+ index);
    this.loading = true;
    
    this.http.get<any>(environment.HOST_API+environment.BASE_API+'offers/getOfferDetailsById/'+id).subscribe(data => {
      this.incomingbookings[index].OfferOriginCharges=data.data.OfferOriginCharges;;
      this.incomingbookings[index].OfferDestinationCharges=data.data.OfferDestinationCharges;;
      this.incomingbookings[index].offerAdditionalServiceOrigin=data.data.offerAdditionalServiceOrigin;;
      this.incomingbookings[index].offerAdditionalServiceDestination=data.data.offerAdditionalServiceDestination;
   
       this.loading = false;
     });
  }
  //to get full offer table data

 
  // Filter() {
  //   this.loading = true;
  //   this.first = 0;
  //   this.anyBooleanPropertyFromComponent = true;

  //   let jsondata = JSON.stringify({
  //     'Ratings': this.ratingsModel,
  //     'Mode': this.modeOfTransportation, 'Origin': this.Toporigin, 'Destination': this.topDestination
  //   });
  //   this.http.get('offers/filter', jsondata).subscribe(data => {
  //     this.OfferId = data.data[0].Offer_Id;
  //     this.datasource = data.data.slice(1, 10);
  //     //this.incomingbookings = this.datasource.reverse();
  //     this.datasource.reverse();
  //     for(var i=0;i<this.datasource.length;i++)
  //     {
  //       this.datasource[i]['OfferOriginCharges']=[];
  //       this.datasource[i]['OfferDestinationCharges']=[];
  //       this.datasource[i]['offerAdditionalServiceOrigin']=[];
  //       this.datasource[i]['offerAdditionalServiceDestination']=[];
  //     }
  //     this.totalRecords = this.datasource.length;
  //     this.incomingbookings = this.datasource;
  //     this.loading = false;
  //     //this.incomingbookings = this.datasource.slice(this.first, (this.first + this.rows));
  //     //this.getTotalTables(this.datasource.length);
  //     //this.documentsTotal = 1;
  //   }, Error => { alert('failed'); });
  // }

  gettags(data){
    let split= data.split(',');
    return split;
  }
  filter(val: string){
    //let data = [];

    if (val.length >= 2) {
      return this.http.get<any>(environment.HOST_API+environment.BASE_API+'airport/filter/'+val)
    }
    // if (this.plane === 1) {
    //   if (val.length >= 2) {
    //     return this._as.getUsers(val);
    //   }
    //   if (val.length < 2) {
    //     return data;
    //   }
    // } else if (this.ship === 1) {
    //   if (val.length >= 2) {
    //     return this._as.getPortUsers(val);
    //   }
    //   if (val.length < 2) {
    //     return data;
    //   }
    // }

    //return data;
  }

  viewBooking(offerid, row) {
    console.log(offerid, row);
    console.log(row.Air_Lcl);
    const dataString = {
      'Customer_Id': this.customerId,
      'Booking_Status': 15,
      'Is_Selected': 0,
      'Offer_Id': offerid,
      'Created_By': this.userId,
      'Modified_By': '',
      'Air_Lcl': row.Air_Lcl,
      'Edit_In_Progress': 0,
      'Edited': 0,
      'Version': 1,
    };
    this.http.post<any>(environment.HOST_API+environment.BASE_API+'Booking/bookOffer', dataString).subscribe(data => {
      console.log(data.data.bookingId);
      const bookingId = data.data.bookingId;
      // const bookingId = data.data.finalBookingNumber;
      this.router.navigate(['booking/', bookingId, this.modeOfTransportation]);
    });

  }
  changeName(){
    if((this.profileForm as FormGroup).get('Mode').value == 'AIR')
    {
      this.originPlaceHolder = "Origin Airport";
      this.destPlaceHolder=  "Destination Airport";
    }
    if((this.profileForm as FormGroup).get('Mode').value == 'LCL')
    {
      this.originPlaceHolder = "Origin port";
      this.destPlaceHolder=  "Destination port";
    }
  
  }

  // toggle between hiding and showing the dropdown content */
  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  cutoff(){
    document.getElementById("cuoffdrop").classList.toggle("show");
  }
  etdDrop()
  { document.getElementById("etddrop").classList.toggle("show");}
  etaDrop(){
    document.getElementById("etadrop").classList.toggle("show");
  }
  fromdate(e){
    e.preventDefault()
  }
}



