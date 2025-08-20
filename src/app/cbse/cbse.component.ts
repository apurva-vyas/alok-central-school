import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.css']
  
})
export class CBSEComponent {

  constructor(private http: HttpClient) {}

  documents = [
    { name: 'As per Board Requirements', path: 'assets\pdfs\AsPerBoardRequirements.pdf' },
    { name: 'Affiliation Letter', path: 'assets\pdfs\AffilationLetter.pdf' },
    { name: 'NOC', path: 'assets\pdfs\noc.pdf' },
    { name: 'Building Safety', path: 'assets\pdfs\BuildingSafetyCrt.pdf' },
    { name: 'Self System Generated Certificate', path: 'assets\pdfs\SelfGenerateCertificate.pdf' },
    { name: 'Fee Structure', path: 'assets\pdfs\FeeStructure.pdf' },
    { name: 'School Management Committee', path: 'assets\pdfs\SMC.pdf' },
    { name: 'Last 3 Year Result of Board Examination', path: 'assets\pdfs\Last3yearResults.pdf' },
    { name: 'Infrastructure Details', path: 'assets\pdfs\INFRASTRUCTURE.pdf' },
    { name: 'Certificate of Recognition', path: 'assets\pdfs\RecognitionCrt.pdf' },
    { name: 'Society Registration', path: 'assets\pdfs\SocietyRegistrationCrt.pdf' },
    { name: 'Fire and Safety', path: 'assets\pdfs\FireSafetyCrt.pdf' },
    { name: 'Land Certificate', path: 'assets\pdfs\LandCertificate.pdf' },
    { name: 'Water and Health Sanitation', path: 'assets\pdfs\WaterSanitationCrt.pdf' },
    { name: 'Annual Academic Calendar', path: 'assets\pdfs\AnnualCalendar.pdf' },
    { name: 'Parents Teachers Association', path: 'assets\pdfs\PTA.pdf' },
    { name: 'Staff Details', path: 'assets\pdfs\StaffDetails.pdf' },
    { name: 'Self Affidavit of School', path: 'assets\pdfs\SelfAffidavit.pdf' }
  ];


   currentPdfPath = this.documents[0].path;

  // A function to change the displayed PDF
  selectPdf(path: string) {
    this.currentPdfPath = path;

  }
}
