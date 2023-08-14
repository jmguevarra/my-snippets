import { AfterViewInit, Component, ComponentRef, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalConstants } from '../constants';
import { DownloadItemComponent } from './download-item/download-item.component';
import { DownloadService } from 'src/app/services/download.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
   standalone: true,
   imports: [CommonModule],
   selector: 'app-downloads-panel',
   templateUrl: './downloads-panel.component.html',
   styleUrls: ['./downloads-panel.component.scss']
})
export class DownloadsPanelComponent implements OnInit, AfterViewInit, OnChanges {
   @Input('closeOnIdle') closeOnIdle: boolean = false;
   @ViewChild('downloadBody', { read: ViewContainerRef }) downloadBody!: ViewContainerRef;
   downloadItemComponents: ComponentRef<DownloadItemComponent>[] = [];

   isMinimized: boolean = true;
   overallProgressText: string = LocalConstants.downloading;
   downloadsIsDone: boolean = false;

   constructor(
      private elementRef: ElementRef, 
      private downloadService: DownloadService,
      private notificationService: NotificationService
   ) {}

   ngOnInit(): void {
      this.isMinimized = false;
      
      this.downloadService.fileQueueSubj.subscribe((data: { url: string; fileName: string; options: any }) => {
         if (!data.url && !this.downloadBody) return;

         if(this.downloadService.currentDownloadingItem() >= this.downloadService.maxDownloadingItem){
            this.downloadService.setQueuedFiles(data);
            return;
         }

         const currentComponent = this.elementRef.nativeElement as HTMLElement;
         if (currentComponent.classList.contains('d-none')) currentComponent.classList.remove('d-none');

         this.downloadService.downloadPanelIsOpen = true;
         const fileId = this.downloadService.generateFileId();
         const downloadItemComponent: ComponentRef<DownloadItemComponent> = this.downloadBody.createComponent(DownloadItemComponent);
         downloadItemComponent.instance.fileId = fileId;
         downloadItemComponent.instance.fileName = data.fileName;
         downloadItemComponent.instance.url = data.url;

         if (data.options) downloadItemComponent.instance.options = data.options;

         downloadItemComponent.instance.remove.subscribe((event) => {
            this.removeChildDownloadItem(downloadItemComponent);
         });
         this.downloadBody.move(downloadItemComponent.hostView, 0);
         this.downloadItemComponents.unshift(downloadItemComponent);
      });
   }

   ngAfterViewInit(): void {
      this.downloadService.downloadsStatus.subscribe((result) => {
         let downloadedItem  = this.downloadItemComponents.filter(i => i.instance.file.completed === true);
         const allDownloadsItemLength = this.downloadItemComponents.length;
         this.downloadsIsDone = downloadedItem.length === allDownloadsItemLength  && allDownloadsItemLength !== 0  ? true : false;

         if(this.downloadsIsDone && result.isDone){
            this.overallProgressText = LocalConstants.downloadSuccess;
            this.notificationService.show(LocalConstants.downloadSuccessNotif, {classname: 'bg-success text-light', autohide: false});
            if(!this.isMinimized) setTimeout(()=> {
               this.downloadService.downloadPanelIsOpen = false;
               this.isMinimized = !this.isMinimized;
            }, 5000);
         }
         if(!result.isDone) this.overallProgressText = LocalConstants.downloading;
         if(result.withError && this.isMinimized) this.overallProgressText = LocalConstants.downloadFailed;
         if(result.withError && !this.isMinimized)
            this.overallProgressText = result.errorCode === LocalConstants.downloadErrorCodeConnectionLost 
               ? LocalConstants.downloadConnectionInterupted 
               : LocalConstants.downloadTimeout;
      });

      this.downloadService.cancelledDownloads.subscribe(confirmation => {
         if (confirmation){
            if(this.downloadService.allDownloadsIsDone()) this.notificationService.show(LocalConstants.downloadDownloadedAlreadyNotif, {classname: 'bg-warning text-light'});
            if(!this.downloadService.allDownloadsIsDone()) this.destroyDownloadItems();
         } 
      });
   }

   ngOnChanges(changes: SimpleChanges): void {
      if(changes.hasOwnProperty('closeOnIdle') && changes['closeOnIdle'].currentValue){
         this.notificationService.clear();
         this.destroyDownloadItems();
      } 
   }

   removeChildDownloadItem(componentRef: ComponentRef<DownloadItemComponent>) {
      const componentRefIndex = this.downloadItemComponents.indexOf(componentRef);
      if (componentRefIndex === -1) return;

      componentRef.destroy();
      this.downloadItemComponents.splice(componentRefIndex, 1);
      this.hideMe();
   }

   minMaxControl() {
      const downloadsWithError = this.downloadItemComponents.filter(i => i.instance.file.hasError === true);
      const downloadsInProgress = this.downloadItemComponents.filter(i => i.instance.file.inProgress === true);
      this.downloadsIsDone = downloadsInProgress.length < 1 ? true : false;
      this.isMinimized = !this.isMinimized;
      
      if(downloadsInProgress.length > 0){
         this.overallProgressText = LocalConstants.downloading;
         return;
      }
      if(downloadsWithError.length > 0 && this.isMinimized) this.overallProgressText = LocalConstants.downloadFailed;
      if(downloadsWithError.length > 0 && !this.isMinimized){
         let firstItemErrorCode = downloadsWithError[0].instance.file.errorCode;
         this.overallProgressText = firstItemErrorCode === LocalConstants.downloadErrorCodeConnectionLost 
            ? LocalConstants.downloadConnectionInterupted 
            : LocalConstants.downloadTimeout;
      }
   }

   cancelDownloads() { 
      this.downloadService.cancelAllDownloads();
      if(this.downloadService.allDownloadsIsDone() && this.downloadItemComponents.length > 0) {
         this.notificationService.clear();
         this.destroyDownloadItems();
      }
   }

   private destroyDownloadItems(){
      this.isMinimized = false;
      this.notificationService.clear();
      this.downloadItemComponents.forEach((componentRef: ComponentRef<DownloadItemComponent>) => {
         componentRef.destroy();
         this.downloadItemComponents = [];
         this.hideMe();
      });
   }

   private hideMe() {
      if (this.downloadItemComponents.length === 0) {
         const currentComponent = this.elementRef.nativeElement as HTMLElement;
         currentComponent.classList.add('d-none');
         this.downloadService.ngOnDestroy();
      }
   }
}
