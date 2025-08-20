import { Component } from '@angular/core';

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.css']
  
})
export class CBSEComponent {

  documents = [
    { name: 'As per Board Requirements', file: 'AsPerBoardRequirements.pdf', src: '/assets/pdfs/AsPerBoardRequirements.pdf' },
    { name: 'Affiliation Letter', file: 'AffilationLetter.pdf', src: '/assets/pdfs/AffilationLetter.pdf' },
    { name: 'NOC', file: 'noc.pdf', src: '/assets/pdfs/noc.pdf' },
    { name: 'Building Safety', file: 'BuildingSafetyCrt.pdf', src: '/assets/pdfs/BuildingSafetyCrt.pdf' },
    { name: 'Self System Generated Certificate', file: 'SelfGenerateCertificate.pdf', src: '/assets/pdfs/SelfGenerateCertificate.pdf' },
    { name: 'Fee Structure', file: 'FeeStructure.pdf', src: '/assets/pdfs/FeeStructure.pdf' },
    { name: 'School Management Committee', file: 'SMC.pdf', src: '/assets/pdfs/SMC.pdf' },
    { name: 'Last 3 Year Result of Board Examination', file: 'Last3yearResults.pdf', src: '/assets/pdfs/Last3yearResults.pdf' },
    { name: 'Infrastructure Details', file: 'INFRASTRUCTURE.pdf', src: '/assets/pdfs/INFRASTRUCTURE.pdf' },
    { name: 'Certificate of Recognition', file: 'RecognitionCrt.pdf', src: '/assets/pdfs/RecognitionCrt.pdf' },
    { name: 'Society Registration', file: 'SocietyRegistrationCrt.pdf', src: '/assets/pdfs/SocietyRegistrationCrt.pdf' },
    { name: 'Fire and Safety', file: 'FireSafetyCrt.pdf', src: '/assets/pdfs/FireSafetyCrt.pdf' },
    { name: 'Land Certificate', file: 'LandCertificate.pdf', src: '/assets/pdfs/LandCertificate.pdf' },
    { name: 'Water and Health Sanitation', file: 'WaterSanitationCrt.pdf', src: '/assets/pdfs/WaterSanitationCrt.pdf' },
    { name: 'Annual Academic Calendar', file: 'AnnualCalendar.pdf', src: '/assets/pdfs/AnnualCalendar.pdf' },
    { name: 'Parents Teachers Association', file: 'PTA.pdf', src: '/assets/pdfs/PTA.pdf' },
    { name: 'Staff Details', file: 'StaffDetails.pdf', src: '/assets/pdfs/StaffDetails.pdf' },
    { name: 'Self Affidavit of School', file: 'SelfAffidavit.pdf', src: '/assets/pdfs/SelfAffidavit.pdf' }
  ]; 
}
