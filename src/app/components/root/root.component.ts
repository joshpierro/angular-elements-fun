import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'annotation-root',
  template: '<annotation-map></annotation-map>',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

}
