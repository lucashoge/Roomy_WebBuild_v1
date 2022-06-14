import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.css']
})
export class MainUiComponent implements OnInit {

  

  ngOnInit(): void {
  }

  // displayVal = 'none';
  colorVal = 'yellow';

  titleImg = 'assets/testimg/IMG_7122.JPG';
  displayVal = 'block';

  public event: boolean;

  constructor() {

    this.event = false;

  }


  


  open02(){
    this.displayVal = 'none';
    this.titleImg = 'assets/testimg/IMG_7121.JPG';
    this.displayVal = 'block';
    

  }
  open03(){
    this.displayVal = 'none';
    this.titleImg = 'assets/testimg/IMG_7120.JPG'
    this.displayVal = 'block';
  }

}
