import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from '../../models/registerModel';
import { RegisterService } from '../../services/register.service';
import { SpinnerService } from '../../services/spinner.service';
import { ToastService } from '../../services/toast.service';
import { NavigateToService } from '../../services/navigate-to.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../auth-service.service';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MyHeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private distroySuscriptions$: Subject<void> = new Subject<void>();

  titlePage = "Registro";
  detailPage = "Registra un usuario nuevo.";

  passwordDiferences: boolean = false;

  registerForm: FormGroup = this.formBuilder.group({});

  constructor(private registerService: RegisterService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private navigateService: NavigateToService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) {

    if (this.authService.isLoged()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {

    this.spinnerService.hide();

    this.setConfirmationMessage("Registrar usuario", "¿Desea registrar el usuario?.", "Usuario registrado correctamente.");

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      mothersLastName: ['', Validators.required],
      birthday: ['', Validators.required],
      address: '',
      zipCode: ['', Validators.required],
      country: '',
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      firstPassword: ['', Validators.required],
      secondPassword: ['', Validators.required]
    });

    this.registerForm.get('firstPassword')?.valueChanges.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.validatePassword();
    });

    this.registerForm.get('secondPassword')?.valueChanges.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.validatePassword();
    });

    this.modalService.confirmEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.register();
    });

  }

  ngOnDestroy() {
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
    this.registerForm?.reset();
  }

  register() {

    if (!this.validateForm()) {
      return;
    }

    let model: RegisterModel = this.registerForm?.value as RegisterModel;

    model.password = this.registerForm?.value.firstPassword;
    model.typeUser = 1;

    this.spinnerService.show();

    this.registerService.register(model).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      next: (res: any) => {

        this.spinnerService.hide();

        this.toastService.setMessageToast("Usuario registrado correctamente.");
        this.toastService.emitShowEvent();

        this.navigateService.navigateTo('/login');

        console.log(res.message);
      },
      error: (err: { message: string; }) => {

        this.spinnerService.hide();

        this.toastService.setMessageToast(err.message);
        this.toastService.emitShowEvent();

        console.log(err);
      }
    });

  }

  validateForm(): boolean {

    this.registerForm?.markAllAsTouched();

    if (!this.registerForm?.valid || this.validatePassword()) {
      console.log("La información no es válida.");
      return false;
    }

    return true;
  }

  validatePassword(): boolean {

    const firstPassword = this.registerForm?.get('firstPassword')?.value;
    const secondPassword = this.registerForm?.get('secondPassword')?.value;

    if (firstPassword != secondPassword) {
      this.passwordDiferences = true;
    } else {
      this.passwordDiferences = false;
    }

    return this.passwordDiferences;
  }

  goLogin() {
    this.navigateService.navigateTo('/login');
  }

  setConfirmationMessage(title: string, confirmationMessage: string, messageSuccess: string) {
    this.modalService.setTitleModal(title);
    this.modalService.setMessageModal(confirmationMessage);
    this.toastService.setTitleToast(title);
  }

}
