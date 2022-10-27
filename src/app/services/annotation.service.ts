import {Injectable } from '@angular/core';
import { MapAnnotationFeature } from '../models/map-annotation-feature';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  
  public annotations:MapAnnotationFeature[] = [];  

  constructor() { }

  saveAnnotation(annotation:MapAnnotationFeature):void{
    console.log('this would call a HTTP service to persist the data');
  }

}
