import { Component } from '@angular/core';

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.css']
  
})
export class CBSEComponent {

  documents = [
    { name: 'As per Board Requirements', file: 'as-per-board-requirements.pdf' },
    { name: 'Affiliation Letter', file: 'affiliation-letter.pdf' },
    { name: 'NOC', file: 'noc.pdf' },
    { name: 'Building Safety', file: 'building-safety.pdf' },
    { name: 'Self System Generated Certificate', file: 'self-system-certificate.pdf' },
    { name: 'Fee Structure', file: 'fee-structure.pdf' },
    { name: 'School Management Committee', file: 'school-management-committee.pdf' },
    { name: 'Last 3 Year Result of Board Examination', file: 'last-3year-results.pdf' },
    { name: 'Infrastructure Details', file: 'infrastructure-details.pdf' },
    { name: 'Certificate of Recognition', file: 'certificate-of-recognition.pdf' },
    { name: 'Society Registration', file: 'society-registration.pdf' },
    { name: 'Fire and Safety', file: 'fire-and-safety.pdf' },
    { name: 'Land Certificate', file: 'land-certificate.pdf' },
    { name: 'Water and Health Sanitation', file: 'water-health-sanitation.pdf' },
    { name: 'Annual Academic Calendar', file: 'academic-calendar.pdf' },
    { name: 'Parents Teachers Association', file: 'pta.pdf' },
    { name: 'Staff Details', file: 'staff-details.pdf' },
    { name: 'Self Affidavit of School', file: 'self-affidavit.pdf' }
  ];
}
