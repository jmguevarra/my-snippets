import { AfterViewInit, Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalConstants } from '../constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CloseConfirmationComponent } from 'src/app/modal/close-confirmation/close-confirmation.component';
import { DownloadItemComponent } from './download-item/download-item.component';
import { DownloadService } from 'src/app/services/download.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-downloads-panel',
  templateUrl: './downloads-panel.component.html',
  styleUrls: ['./downloads-panel.component.scss']
})
export class DownloadsPanelComponent implements OnInit, AfterViewInit {
  @ViewChild('downloadBody', { read: ViewContainerRef }) downloadBody!: ViewContainerRef;
  downloadItemComponents: ComponentRef<DownloadItemComponent>[] = [];
  
  isMinimized: boolean = true;
  overallProgressText: string = LocalConstants.downloading;
  downloadsIsDone: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private modalService: NgbModal,
    private downloadService: DownloadService
  ) { }

  ngOnInit(): void {
    this.isMinimized = false;
    
    this.downloadService.fileQueueSubj.subscribe((data: {url: string, fileName: string})=>{
      if(!data.url && !this.downloadBody) return;
   
      const currentComponent = this.elementRef.nativeElement as HTMLElement;
      if(currentComponent.classList.contains('d-none')) currentComponent.classList.remove('d-none');

      const fileId = this.downloadService.generateFileId();
      const downloadItemComponent:  ComponentRef<DownloadItemComponent> = this.downloadBody.createComponent(DownloadItemComponent);
      downloadItemComponent.instance.fileId = fileId;
      downloadItemComponent.instance.fileName = data.fileName;
      downloadItemComponent.instance.url = data.url;
      downloadItemComponent.instance.remove.subscribe((event)=>{
        this.removeChildDownloadItem(downloadItemComponent);
      });
      this.downloadBody.move(downloadItemComponent.hostView, 0);
      this.downloadItemComponents.unshift(downloadItemComponent);
    });
  }

  ngAfterViewInit(): void {
    this.downloadService.downloadsIsDone.subscribe((isDone)=>{
      this.downloadsIsDone = isDone;
      if(isDone) this.overallProgressText = LocalConstants.downloadSuccess;
      if(!isDone) this.overallProgressText = LocalConstants.downloading;
    });
  }


  removeChildDownloadItem(componentRef: ComponentRef<DownloadItemComponent>){
    const componentRefIndex = this.downloadItemComponents.indexOf(componentRef);
    if(componentRefIndex === -1) return;

    componentRef.destroy();
    this.downloadItemComponents.splice(componentRefIndex, 1);
    this.hideMe();
  }

  minMaxControl(){
    this.isMinimized = !this.isMinimized;
  }

  cancelDownloads(){
    const modalRef = this.modalService.open(CloseConfirmationComponent, {
      windowClass: 'exitModal',
      centered: true,
      size: 'xxs',
    });
    modalRef.componentInstance.modalTitle =  LocalConstants.cancelDownloadsTitle;
    modalRef.componentInstance.modalDescription =  LocalConstants.cancelDownloadsContent;
    modalRef.componentInstance.modalButtonYes = 'Yes';
    modalRef.componentInstance.modalButtonNo = 'No';
    modalRef.componentInstance.isClosed.subscribe((confirmation: boolean)=>{
      if(confirmation && this.downloadItemComponents.length > 0){
        this.downloadItemComponents.forEach((componentRef: ComponentRef<DownloadItemComponent>) => {
          componentRef.destroy();
          this.downloadItemComponents = [];
          this.hideMe();
        });
      }
    });
  }

  private hideMe(){
    if(this.downloadItemComponents.length === 0){
      const currentComponent = this.elementRef.nativeElement as HTMLElement;
      currentComponent.classList.add('d-none');
      this.downloadService.ngOnDestroy();
    }
  }

}
