import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

@Injectable()
export class ContactComponent {
  constructor(private http: HttpClient) { }
 
  number!: string;
  email!: string;
  message!: string;
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  name!:string;
  submit(): void{
   
  }
}
