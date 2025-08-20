import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { HomeComponent } from './home/home.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { ContactComponent } from './contact/contact.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ResultComponent } from './result/result.component';
import { CBSEComponent } from './cbse/cbse.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path: 'about', component:AboutPageComponent},
  {path: 'services', component:ServicesComponent },
  {path: 'admission', component:AdmissionsComponent },
  {path: 'contact', component:ContactComponent },
  {path: 'gallery', component:GalleryComponent },
  {path: 'result', component:ResultComponent },
  {path: 'cbse', component:CBSEComponent },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
