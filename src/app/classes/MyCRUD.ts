import { ActivatedRoute } from "@angular/router";
import { ModalService } from "../services/modal.service";
import { SpinnerService } from "../services/spinner.service";
import { ToastService } from "../services/toast.service";
import { MyService } from "../services/myService.service";
import { FormGroup } from "@angular/forms";
import { NavigateToService } from "../services/navigate-to.service";
import { Subject, takeUntil } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class MyCRUD<T> {

    private distroy$: Subject<void> = new Subject<void>();

    idParameter : number | undefined;
    private data : any | undefined;
    private modelFound = false;
    private formModel: FormGroup | undefined;
    private confirmationMessageSucces: string = '';
    private removeButtonPressed: boolean = false;

    private urlRedirectCreate: string | undefined;
    private urlRedirectUpdate: string | undefined;
    private urlRedirectDelete: string | undefined;

    constructor(private service: MyService<T>, private spinnerService: SpinnerService, private modalService: ModalService, private toastService: ToastService, private activatedRoute: ActivatedRoute, private navigateTo: NavigateToService){

    }

    onInit(){

        this.activatedRoute.paramMap.pipe(takeUntil(this.distroy$)).subscribe(params => {
            const id = params.get('id');
            this.idParameter = id ? parseInt(id) : undefined;
            this.setIdParameter(this.idParameter);
        });
      
        this.modalService.confirmEvent$.pipe(takeUntil(this.distroy$)).subscribe(() => {
            this.removeButtonPressed ? this.delete() : this.save();
        });

        this.read();
    }

    ngOnDestroy() {
        this.distroy$.next();
        this.distroy$.complete();
        this.formModel?.reset();
    }

    create(model: T) {

        this.service.create(model).pipe(takeUntil(this.distroy$)).subscribe({
            next: (res: any) => {
                this.showMessage(this.confirmationMessageSucces + ' Key: '+res.data.key);
                // this.formModel?.reset();
                this.spinnerService.hide();
                this.redirectCreate();
            },
            error: (err: { message: string; }) => {
                this.showMessage(err.message);
                this.spinnerService.hide();
            }
        });

    }

    read() {

        if (this.idParameter) {

            this.spinnerService.show();

            this.service.find(this.idParameter).pipe(takeUntil(this.distroy$)).subscribe(
                {
                    next: (res: { data: any; }) => {
                        this.data = res.data;
                        this.modelFound = true;
                        this.place(res.data);
                        this.spinnerService.hide();
                    },
                    error: (err: { message: string; }) => {
                        this.modelFound = false;
                        this.showMessage(err.message);
                    }
                }
            )

        }

    }

    update(id:number, model:T) {
    
        this.service.update(id,model).pipe(takeUntil(this.distroy$)).subscribe({
            next: res => {
                this.showMessage(this.confirmationMessageSucces + ' Key: '+id);
                // this.formModel?.reset();
                this.spinnerService.hide();
                this.redirectUpdate();
            },
            error: err => {
                this.showMessage(err.message);
                this.spinnerService.hide();
            }
        });
    
    }

    delete() {
        this.service.remove(this.idParameter ?? 0).pipe(takeUntil(this.distroy$)).subscribe({
            next: res => {
                this.showMessage(this.confirmationMessageSucces + ' Key: '+this.idParameter);
                // this.formModel?.reset();
                this.spinnerService.hide();
                this.redirectDelete();
            },
            error: err => {
                this.showMessage(err.message);
                this.spinnerService.hide();
            }
        });
    }

    place(data:any) {

    }

    save() {

        if (!this.validateForm()) {
            return;
        }
        
        let model: T = this.formModel?.value as T;

        this.spinnerService.show();

        this.idParameter ? this.create(model) : null;

    }

    validateForm(): boolean {

        this.formModel?.markAllAsTouched();

        if (!this.formModel?.valid) {
            console.log("La información no es válida.");
            return false;
        }

        return true;
    }

    showMessage(message:string) {
        this.toastService.setMessageToast(message);
        this.toastService.emitShowEvent();
        this.spinnerService.hide();
    }

    setIdParameter(idParameter: number | undefined){
        this.idParameter = idParameter;
    }

    setFormModel(formModel: FormGroup){
        this.formModel = formModel;
    }

    setConfirmationMessage(title:string, confirmationMessage:string, messageSuccess:string) {
        this.modalService.setTitleModal(title);
        this.modalService.setMessageModal(confirmationMessage);

        this.toastService.setTitleToast(title);
        this.confirmationMessageSucces = messageSuccess;
    }

    getSpinnerService() {
        return this.spinnerService;
    }

    getIdParameter() {
        return this.idParameter;
    }

    getData() {
        
        if (!this.data || !this.data.length) {
            this.data = [
                {
                    key:null
                }

            ];
        }

        return this.data;
    }

    getFormModel() {
        return this.formModel;
    }

    getService() {
        return this.service;
    }

    setRemoveButtonPressed(action:boolean) {
        this.removeButtonPressed = action;
    }

    setUrlRedirectCreate(url:string | undefined){
        this.urlRedirectCreate = url;
    }

    setUrlRedirectUpdate(url:string | undefined){
        this.urlRedirectUpdate = url;
    }

    setUrlRedirectDelete(url:string | undefined){
        this.urlRedirectDelete = url;
    }
    
    redirect(urlRedirect:string | undefined){

        if (!urlRedirect) {
            return;
        }

        this.navigateTo.navigateTo(urlRedirect);
    }

    redirectCreate() {

        if (!this.urlRedirectCreate) {
            return;
        }

        this.navigateTo.navigateTo(this.urlRedirectCreate);
    }

    redirectUpdate() {

        if (!this.urlRedirectUpdate) {
            return;
        }

        this.navigateTo.navigateTo(this.urlRedirectUpdate);
    }

    redirectDelete() {

        if (!this.urlRedirectDelete) {
            return;
        }

        this.navigateTo.navigateTo(this.urlRedirectDelete);
    }

    reloadPage() {
        this.navigateTo.reloadPage();
    }

}