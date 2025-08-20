import { Component } from '@angular/core';

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.css']
  
})
export class CBSEComponent {

  documents = [
    { name: 'As per Board Requirements', file: 'AsPerBoardRequirements.pdf' },
    { name: 'Affiliation Letter', file: 'AffilationLetter.pdf' },
    { name: 'NOC', file: 'noc.pdf' },
    { name: 'Building Safety', file: 'BuildingSafetyCrt.pdf' },
    { name: 'Self System Generated Certificate', file: 'SelfGenerateCertificate.pdf' },
    { name: 'Fee Structure', file: 'FeeStructure.pdf' },
    { name: 'School Management Committee', file: 'SMC.pdf' },
    { name: 'Last 3 Year Result of Board Examination', file: 'Last3yearResults.pdf' },
    { name: 'Infrastructure Details', file: 'INFRASTRUCTURE.pdf' },
    { name: 'Certificate of Recognition', file: 'RecognitionCrt.pdf' },
    { name: 'Society Registration', file: 'SocietyRegistrationCrt.pdf' },
    { name: 'Fire and Safety', file: 'FireSafetyCrt.pdf' },
    { name: 'Land Certificate', file: 'LandCertificate.pdf' },
    { name: 'Water and Health Sanitation', file: 'WaterSanitationCrt.pdf' },
    { name: 'Annual Academic Calendar', file: 'AnnualCalendar.pdf' },
    { name: 'Parents Teachers Association', file: 'PTA.pdf' },
    { name: 'Staff Details', file: 'StaffDetails.pdf' },
    { name: 'Self Affidavit of School', file: 'SelfAffidavit.pdf' }
  ];
}
