import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconComponent } from './shared/icon/icon.component';
import { PageHeroComponent } from './shared/page-hero/page-hero.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { CarouselComponent } from './carousel/carousel.component';
import { FeaturesComponent } from './features/features.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ServicesComponent } from './services/services.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { ContactComponent } from './contact/contact.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ResultComponent } from './result/result.component';
import { CBSEComponent } from './cbse/cbse.component';
import { VideoGalleryComponent } from './video-gallery/video-gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent,
    PageHeroComponent,
    BsNavbarComponent,
    FeaturesComponent,
    FooterComponent,
    HomeComponent,
    AboutPageComponent,
    ServicesComponent,
    AdmissionsComponent,
    ContactComponent,
    GalleryComponent,
    ResultComponent,
    CBSEComponent,
    VideoGalleryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    CarouselComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
