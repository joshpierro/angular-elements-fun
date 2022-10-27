// angular 
import { Component, OnInit, ViewChild } from '@angular/core';

// 3rd party - ArcGIS 
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Sketch from '@arcgis/core/widgets/Sketch';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

// app
import { INITIAL_MAP_ZOOM_LEVEL, INITIAL_MAP_CENTER, BASEMAP,SKETCH_TOOL_POSITION, FEATURE_ID_FIELD } from '../../constants/annotation.constants';
import { EditEvents, EditState, EventState } from '../../constants/annotation.enums';
import { AnnotationFormComponent } from '../annotation-form/annotation-form.component';

@Component({
  selector: 'annotation-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  public map: Map = new Map();
  public view : MapView = new MapView(); 
  private graphicsLayer = new GraphicsLayer();
  private sketch : Sketch | undefined;
  @ViewChild(AnnotationFormComponent) dataPanel : AnnotationFormComponent | undefined;
  
  ngOnInit(): void {
    this.initializeMap();
  }

  public selectFeatureOnMap(featureId: number):void{
    const feature = this.graphicsLayer.graphics.find(g=>g.get(FEATURE_ID_FIELD)===featureId);
    this.setFeatureToUpdateMode(feature);
  }

  private setFeatureToUpdateMode(feature: __esri.Graphic) {
    this.sketch?.complete();
    this.sketch?.update(feature);
  }

  private initializeMap():void {
    const mapDiv = 'viewDiv';
    this.map = new Map({
      basemap: BASEMAP,
      layers: [this.graphicsLayer]
    });
    this.view = new MapView({
      container: mapDiv,
      zoom: INITIAL_MAP_ZOOM_LEVEL,
      center:INITIAL_MAP_CENTER,
      map: this.map
    });
    this.view.when(()=>this.setUpSketchTools());
  }

  private setUpSketchTools() {
  this.sketch = new Sketch({
      layer: this.graphicsLayer,
      view: this.view,
      creationMode: EditState.update
    });
    
    this.sketch.visibleElements = {
      createTools: {
        circle: false
      },
      selectionTools:{
        'lasso-selection': false,
        'rectangle-selection': false
      },
      settingsMenu: false
    };

    this.view.ui.add(this.sketch, SKETCH_TOOL_POSITION);
    this.setUpSketchEvents();
  }

  private setUpSketchEvents() {
    this.sketch?.on(EditEvents.create, (event)=> {
      if (event.state === EventState.complete) {
        this.createFeatureAttributes(event);
      }
    });
    this.sketch?.on(EditEvents.delete,(event)=>{
      const [feature] = event.graphics;
      this.dataPanel?.handleDeleteFeature(feature);
    });
    this.sketch?.on(EditEvents.update,(event)=>{
      const [feature] = event.graphics;
      this.dataPanel?.updateAnnotationGeometry(feature);
    });
    this.sketch?.on(EditEvents.redo,(event)=>{
      const [feature] = event.graphics;
      this.dataPanel?.updateAnnotationGeometry(feature);
    });
    this.sketch?.on(EditEvents.undo,(event)=>{
      const [feature] = event.graphics;
      this.dataPanel?.updateAnnotationGeometry(feature);
    });
  }
  public clearSelection():void{
    this.deselectFeatures();
  }

  private deselectFeatures():void{
    this.sketch?.cancel();
  }

  private createFeatureAttributes(event:__esri.SketchCreateEvent) {
    this.dataPanel?.createNewFeatureAttributes(event);
  }

}
