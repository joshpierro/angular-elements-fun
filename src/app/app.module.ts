//angular 
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {createCustomElement} from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input'
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

// app
import { MapComponent } from './components/map/map.component';
import { RootComponent } from './components/root/root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnnotationFormComponent } from './components/annotation-form/annotation-form.component';


@NgModule({
  declarations: [ RootComponent,MapComponent, AnnotationFormComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { 

  constructor(private injector:Injector) {}
  
  ngDoBootstrap(){
    const mapElement = createCustomElement(MapComponent, {injector: this.injector});
    customElements.define('annotation-map',mapElement);
  }

}

