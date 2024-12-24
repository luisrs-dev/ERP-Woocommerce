import { isAuthenticatedGuard } from './../../guards/isAuthenticated.guard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../angular-material/material.module';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { AuthService } from './../../auth.service';
import { AuthStatus } from './../../interfaces/auth-status.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private changeDetectorRef = inject(ChangeDetectorRef); 
  public authStatus: AuthStatus = AuthStatus.notAuthenticated;
  public loading: boolean = false;

  ngOnInit(){
    this.authService.autoAuthUser();
    if(this.authService.getIsAuthenticated()){
      this.router.navigateByUrl('/dashboard');
    }
  }

  public myForm: FormGroup = this.fb.group({
    email: [environment.userDefault.email, [Validators.required, Validators.email]],
    password: [environment.userDefault.password, [Validators.required, Validators.minLength(4)]],
  });

  onSubmit(): void {
    this.loading = true;
    this.authStatus = AuthStatus.checking;
    const { email, password } = this.myForm.value;
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.router.navigateByUrl('/dashboard');
    
    //this.authService.login(email, password).subscribe({
    //  next: () => this.router.navigateByUrl('/dashboard'),
    //  error: (message) => {
    //    this.authStatus = AuthStatus.notAuthenticated;
    //    this.snackBar.open(`Error: ${message}`, 'Entendido', {duration: 3000});
    //    this.loading = false;
    //    this.changeDetectorRef.detectChanges();

    //  },
    //  complete:() => {
    //    this.loading = false;
    //    this.changeDetectorRef.detectChanges();
    //  }
    //});
  }
}
