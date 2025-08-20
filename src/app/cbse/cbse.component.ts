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
    { name: 'As per Board Requirements', file: 'AsPerBoardRequirements.pdf', src: 'assets/pdfs/AsPerBoardRequirements.pdf' },
    { name: 'Affiliation Letter', file: 'AffilationLetter.pdf', src: 'https://alok-central-school.s3.ap-south-1.amazonaws.com/AffilationLetter.pdf' },
    { name: 'NOC', file: 'noc.pdf', src: 'assets/pdfs/noc.pdf' },
    { name: 'Building Safety', file: 'BuildingSafetyCrt.pdf', src: 'assets/pdfs/BuildingSafetyCrt.pdf' },
    { name: 'Self System Generated Certificate', file: 'SelfGenerateCertificate.pdf', src: 'assets/pdfs/SelfGenerateCertificate.pdf' },
    { name: 'Fee Structure', file: 'FeeStructure.pdf', src: 'assets/pdfs/FeeStructure.pdf' },
    { name: 'School Management Committee', file: 'SMC.pdf', src: 'assets/pdfs/SMC.pdf' },
    { name: 'Last 3 Year Result of Board Examination', file: 'Last3yearResults.pdf', src: 'assets/pdfs/Last3yearResults.pdf' },
    { name: 'Infrastructure Details', file: 'INFRASTRUCTURE.pdf', src: 'assets/pdfs/INFRASTRUCTURE.pdf' },
    { name: 'Certificate of Recognition', file: 'RecognitionCrt.pdf', src: 'assets/pdfs/RecognitionCrt.pdf' },
    { name: 'Society Registration', file: 'SocietyRegistrationCrt.pdf', src: 'assets/pdfs/SocietyRegistrationCrt.pdf' },
    { name: 'Fire and Safety', file: 'FireSafetyCrt.pdf', src: 'assets/pdfs/FireSafetyCrt.pdf' },
    { name: 'Land Certificate', file: 'LandCertificate.pdf', src: 'assets/pdfs/LandCertificate.pdf' },
    { name: 'Water and Health Sanitation', file: 'WaterSanitationCrt.pdf', src: 'assets/pdfs/WaterSanitationCrt.pdf' },
    { name: 'Annual Academic Calendar', file: 'AnnualCalendar.pdf', src: 'assets/pdfs/AnnualCalendar.pdf' },
    { name: 'Parents Teachers Association', file: 'PTA.pdf', src: 'assets/pdfs/PTA.pdf' },
    { name: 'Staff Details', file: 'StaffDetails.pdf', src: 'assets/pdfs/StaffDetails.pdf' },
    { name: 'Self Affidavit of School', file: 'SelfAffidavit.pdf', src: 'assets/pdfs/SelfAffidavit.pdf' }
  ];

  openPdfInNewTab(pdfUrl: string, fileName: string): void {
    // Try to load via HTTP first for better cross-browser compatibility
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        // Check if we received a valid PDF blob
        if (response.size > 0 && response.type === 'application/pdf') {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          
          // Open in new tab
          const newWindow = window.open(url, '_blank');
          if (newWindow) {
            newWindow.document.title = fileName;
          }
          
          // Clean up the URL object after a delay to prevent memory leaks
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 2000);
        } else {
          // If blob is invalid, try direct link
          this.openDirectLink(pdfUrl, fileName);
        }
      },
      error: (error) => {
        console.error('Error loading PDF via HTTP:', error);
        // Fallback: try direct link
        this.openDirectLink(pdfUrl, fileName);
      }
    });
  }

  private openDirectLink(pdfUrl: string, fileName: string): void {
    console.log('Trying direct PDF link:', pdfUrl);
    
    // Construct absolute URL for server deployment
    const baseUrl = window.location.origin;
    const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `${baseUrl}/${pdfUrl}`;
    
    // Open PDF directly
    const newWindow = window.open(fullUrl, '_blank');
    if (!newWindow) {
      // If popup blocked, show download link
      console.warn('Popup blocked. PDF URL:', fullUrl);
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
