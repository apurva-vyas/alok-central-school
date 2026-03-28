import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { HomeComponent } from './home/home.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { ContactComponent } from './contact/contact.component';
import { GalleryComponent } from './gallery/gallery.component';
import { MomentsComponent } from './moments/moments.component';
import { ResultComponent } from './result/result.component';
import { CBSEComponent } from './cbse/cbse.component';
import { VideoGalleryComponent } from './video-gallery/video-gallery.component';
import { LoginComponent } from './login/login.component';
import { FacultyComponent } from './faculty/faculty.component';
import { BoardResultsComponent } from './board-results/board-results.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './shared/auth.guard';
import { environment } from '../environments/environment';

const galleryComponent = environment.featureFlags.useNewGallery
  ? MomentsComponent
  : GalleryComponent;

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'admission', component: AdmissionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'gallery', component: galleryComponent },
  { path: 'moments', component: MomentsComponent },
  { path: 'videos', component: VideoGalleryComponent },
  { path: 'result', component: ResultComponent },
  { path: 'cbse', component: CBSEComponent },
  { path: 'faculty', component: FacultyComponent },
  { path: 'results', component: BoardResultsComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
