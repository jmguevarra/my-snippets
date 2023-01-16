import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, createUrlTreeFromSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CloseConfirmationComponent } from 'src/app/modal/close-confirmation/close-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class RouterGuard implements CanDeactivate<Component> {

  constructor(private modalService: NgbModal){}

  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot | undefined): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise((resolve) => {
      const modalRef = this.modalService.open(CloseConfirmationComponent, {
        centered: true,
        size: 'xxs',
      });
      modalRef.componentInstance.modalTitle = "Are you sure you want to leave without <br>submitting your request?";
      modalRef.componentInstance.modalDescription = "Any changes will be discarded.";
      modalRef.componentInstance.isClosed.subscribe((confirmation: boolean)=>{
        if(confirmation){
          resolve(true);
        }else{
          resolve(false);
        }
      });

    });
  }
}
