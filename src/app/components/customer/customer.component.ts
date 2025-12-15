import { Component } from '@angular/core';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { MyCRUD } from '../../classes/MyCRUD';
import { CustomerModel } from '../../models/customerModel';
import { CustomerService } from '../../services/customer.service';
import { SpinnerService } from '../../services/spinner.service';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigateToService } from '../../services/navigate-to.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [MyHeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent extends MyCRUD<CustomerModel>{
  titlePage = "Cliente";
  detailPage = "Crea o edita un cliente.";
  customerForm: FormGroup = this.formBuilder.group({});

  customerId: number | undefined;
  customerFound = false;
  removeCustomerPressed = false;
  
  constructor(customerService: CustomerService, 
    spinnerService: SpinnerService, 
    modalService: ModalService, 
    toastService: ToastService, 
    private formBuilder: FormBuilder, 
    activatedRoute: ActivatedRoute, 
    navigateTo: NavigateToService,
    private  mySpinnerService: SpinnerService) {
    super(customerService, spinnerService, modalService, toastService, activatedRoute, navigateTo);
  }

  ngOnInit() {

    this.mySpinnerService.hide();

    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      mothersLastName: ['', Validators.required],
      zipCode: ['', Validators.required],
      listPrice: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });


    this.onInit();
    this.setFormModel(this.customerForm);
    this.setConfirmationMessage('Carga', '¿Desea guardar el cliente?.','Cliente guardado.');

    this.setUrlRedirectCreate("/customers/");
    this.setUrlRedirectUpdate("/customer/" + this.getIdParameter());
    this.setUrlRedirectDelete("/customers");
    
  }

  override ngOnDestroy(): void {
      super.ngOnDestroy();
  }

  override place(data: any): void {

    if (!data) {
      this.customerFound = false;
      return;
    }

    this.customerFound = true;
    this.customerId = this.getIdParameter();

    this.getFormModel()?.setValue({
      name: data.name,
      lastName: data.lastName,
      mothersLastName: data.mothersLastName,
      zipCode: data.zipCode,
      listPrice: data.listPrice,
      address: data.address,
      phoneNumber: data.phoneNumber
    });

  }

  override save(): void {

    if (!this.validateForm()) {
        return;
    }
    
    let model: CustomerModel = this.getFormModel()?.value as CustomerModel;
    let data = this.getData();
    
    model.key = data.key;
    model.rfc = "XAXX010101000";
    model.keyBusiness = 0;

    this.getSpinnerService().show();

    !this.getIdParameter() ? this.create(model) : this.update(this.getIdParameter() ?? 0, model);
  }

  
  saveAction() {
    this.setRemoveButtonPressed(false);
    this.setConfirmationMessage("Guardar cliente", "¿Desea guardar el cliente?.", "Cliente guardado.");
  }

  remove() {
    this.setRemoveButtonPressed(true);
    this.setConfirmationMessage("Eliminar cliente", "¿Desea eliminar el cliente?.", "Cliente eliminado.");
  }
}
