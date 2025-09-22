import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicService, Clinic, ClinicDoctor } from '../../core/services/clinic.service';
import { DoctorsService, Doctor } from '../../core/services/doctors.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-clinics',
  standalone: true,

  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss']
})
export class ClinicsComponent  {

}
