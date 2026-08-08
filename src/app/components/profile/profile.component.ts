import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { CommonModule } from '@angular/common';
import { MyCRUD } from '../../classes/MyCRUD';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { NavigateToService } from '../../services/navigate-to.service';
import { ProfileModel } from '../../models/profileModel';
import { ProfileService } from '../../services/profile.service';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MyHeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  private distroy$: Subject<void> = new Subject<void>();

  titlePage = "Perfil";
  detailPage = "Configurar los datos de tu usuario.";

  profileForm: FormGroup = this.formBuilder.group({});
  private confirmationMessageSucces: string = '';
  firstPassword: string = "";
  secondPassword: string = "";
  passwordDiferences: boolean = false;

  constructor( 
      private profileService: ProfileService,
      private spinnerService: SpinnerService, 
      private modalService: ModalService, 
      private toastService: ToastService, 
      private formBuilder: FormBuilder, 
      private activatedRoute: ActivatedRoute, 
      private navigateTo: NavigateToService,
      private  mySpinnerService: SpinnerService) {
  
  }

  ngOnInit() {  

    this.mySpinnerService.show();
    
    this.setConfirmationMessage("Guardar perfil", "¿Desea guardar la información?.", "Perfil guardado.");

    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      mothersLastName: ['', Validators.required],
      birthday: ['', Validators.required],
      address: '',
      zipCode: ['', Validators.required],
      country: '',
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      firstPassword: [''],
      secondPassword: ['']
      
    });


    this.profileService.getData("getProfile").pipe(
      takeUntil(this.distroy$),
      finalize(() => this.spinnerService.hide())
    ).subscribe({
        next: (res: any) => {

          const profile = res?.data?.data ?? res?.data;

          if (!profile || typeof profile !== 'object') {
            console.log(res?.message || "No se encontró el perfil.");
            return;
          }

          this.profileForm?.patchValue({
            name: profile.name ?? '',
            lastName: profile.lastName ?? '',
            mothersLastName: profile.mothersLastName ?? '',
            birthday: this.formatDate(profile.birthday),
            address: profile.address ?? '',
            zipCode: profile.zipCode ?? '',
            country: profile.country ?? '',
            email: profile.email ?? '',
            phoneNumber: profile.phoneNumber ?? '',
            firstPassword: "",
            secondPassword: ""
          });
   
        },
        error: (err: { message: string; }) => {
          this.toastService.setMessageToast(err.message);
          this.toastService.emitShowEvent();
        }
    });

    this.modalService.confirmEvent$.pipe(takeUntil(this.distroy$)).subscribe(() => {
      this.save();
    });
    
  }

  ngOnDestroy() {
      this.distroy$.next();
      this.distroy$.complete();
      this.profileForm?.reset();
  }

  validateForm(): boolean {

    this.profileForm?.markAllAsTouched();

        if (!this.profileForm?.valid || this.validatePassword()) {
            console.log("La información no es válida.");
            return false;
        }

        return true;
  }

  save(): void {

    if (!this.validateForm()) {
        return;
    }
    
    let model: ProfileModel = this.profileForm?.value as ProfileModel;

    if (model.firstPassword && model.secondPassword) {
      model.password = model.firstPassword;
    }
  
    this.mySpinnerService.show();

    this.profileService.updateProfile(model).pipe(takeUntil(this.distroy$)).subscribe({
      next: (res: any) => {

        this.toastService.setMessageToast("Se han guardado los cambios.");
        this.toastService.emitShowEvent();

        this.spinnerService.hide();

        console.log(res.message);
  
      },
      error: (err: { message: string; }) => {
        this.spinnerService.hide();
        this.toastService.setMessageToast(err.message);
        this.toastService.emitShowEvent();
      }
    });

  }

  validatePassword(): boolean {
    
    if (this.firstPassword != this.secondPassword) {
      this.passwordDiferences = true;
    } else {
      this.passwordDiferences = false;
    }

    return this.passwordDiferences;
  }

  formatDate(date: any): string {

    if (!date) {
      return "";
    }

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "";
    }

    return formattedDate.toISOString().split("T")[0];
  }

  setConfirmationMessage(title:string, confirmationMessage:string, messageSuccess:string) {
    this.modalService.setTitleModal(title);
    this.modalService.setMessageModal(confirmationMessage);

    this.toastService.setTitleToast(title);
    this.confirmationMessageSucces = messageSuccess;
  }


}
