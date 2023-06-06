import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { FeaturesComponent } from './features/features.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserModule }  from '@angular/platform-browser';
import { CarouselComponent } from './carousel/carousel.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ServicesComponent } from './services/services.component';
import { HomeComponent } from './home/home.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { FormsModule }   from '@angular/forms';
import { ContactComponent } from './contact/contact.component';
import { CommonModule } from '@angular/common';
import {HttpClientModule , HttpErrorResponse} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from './gallery/gallery.component';
import { ResultComponent } from './result/result.component';




@NgModule({
  declarations: [
    AppComponent,
    BsNavbarComponent,    
    FeaturesComponent,
    FooterComponent,
    
    AboutPageComponent,
    ServicesComponent,
    HomeComponent,
    AdmissionsComponent,
    ContactComponent,
    GalleryComponent,
    ResultComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    CarouselComponent  
 
 
  ],
  providers: [],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
