// angular 
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnnotationService } from 'src/app/services/annotation.service';

// third party 
import { BehaviorSubject} from 'rxjs';

//app
import { MapAnnotationFeature } from '../../models/map-annotation-feature';
import { FEATURE_ID_FIELD } from 'src/app/constants/annotation.constants';

@Component({
  selector: 'annotation-form',
  templateUrl: './annotation-form.component.html',
  styleUrls: ['./annotation-form.component.css']
})
export class AnnotationFormComponent {

  public showFeatureAttributes = false;
  public showAnnotationList = true;
  public annotationMapFeature : MapAnnotationFeature = {id: null, notes: null,  geometry: null};
  public annotations$  = new BehaviorSubject<MapAnnotationFeature[]>([]);
  public annotationForm = new FormGroup({
    notes : new FormControl('')
  });
  @Output() featureSelection = new EventEmitter<number>();
  @Output() clearSelection = new EventEmitter();
  
  constructor(private annotationService: AnnotationService) { }
  
  public createNewFeatureAttributes(event:__esri.SketchCreateEvent): void{
    this.showFeatureAttributes = true;
    this.annotationMapFeature.id = event.graphic.get(FEATURE_ID_FIELD);
    this.annotationMapFeature.geometry = event.graphic.geometry.toJSON();
  }

  public updateAnnotationGeometry(feature: __esri.Graphic):void{
    const featureId = feature.get(FEATURE_ID_FIELD) as number;
    this.selectAnnotation(featureId,feature);
  }

  public onSubmit():void {
    this.showFeatureAttributes = false;
    this.showAnnotationList = true;
    let currentAnnotations = this.annotations$.getValue();
    currentAnnotations = currentAnnotations.filter(a=>a.id!==this.annotationMapFeature.id);
    const newAnnotation = {
      id: this.annotationMapFeature.id,
      notes: this.annotationForm.controls.notes.value,
      geometry: JSON.stringify(this.annotationMapFeature.geometry) 
    };
    this.annotationService.saveAnnotation(newAnnotation)
    currentAnnotations.push(newAnnotation);
    this.annotations$.next(currentAnnotations);
    this.resetAnnotationForm();
    this.clearSelection.emit();
  }

  public handleFeatureSelectionInList(featureId: number):void{
    this.featureSelection.emit(featureId);
    this.selectAnnotation(featureId);
  }

  public selectAnnotation(featureId: number, feature?:__esri.Graphic):void{
    const currentAnnotations = this.annotations$.getValue()
    const selectedAnnotation = currentAnnotations.find(a=>a.id===featureId) || {id: null, notes: null, geometry: null} ;
    const geometry = feature ? feature.geometry.toJSON() : selectedAnnotation.geometry;
    this.annotationMapFeature = {id: featureId, notes: selectedAnnotation.notes, geometry : geometry};
    this.annotationForm.controls.notes.setValue(selectedAnnotation.notes);
    this.showFeatureAttributes = true;
  }

  public handleDeleteFeature(feature:__esri.Graphic):void{
    const currentAnnotations = this.annotations$.getValue();
    const featureId = feature.get(FEATURE_ID_FIELD) as number
    const filteredAnnotations = currentAnnotations.filter(a=>a.id!==featureId);
    this.annotations$.next(filteredAnnotations);
    this.resetFeatureAttributes();
  }

  public resetAnnotationForm():void{
    this.annotationForm.reset();
    this.annotationMapFeature = {id: null, notes: null, geometry: null};
    this.showFeatureAttributes = false;
    this.clearSelection.emit();
  }

  private resetFeatureAttributes():void{
    this.annotationMapFeature = {id: null, notes: null, geometry: null};
    this.resetAnnotationForm();
    this.showFeatureAttributes = false;
  }

}
