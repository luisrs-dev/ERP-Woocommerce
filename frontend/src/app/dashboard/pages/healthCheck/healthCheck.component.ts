import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-health-check',
  standalone: true,
  imports: [CommonModule],
  styleUrl: 'healthCheck.component.css',
  templateUrl: './healthCheck.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HealthCheckComponent {

   urlSafe: SafeResourceUrl;
   url: string = environment.healthCheckURL;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
