import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse, HttpEventType, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { FileBlobDownload } from '../../models/file/blob-download.model';
import { EMPTY, Subscription, catchError, map, retry, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DownloadService } from 'src/app/services/download.service';
import { LocalConstants } from '../../constants';

@Component({
   standalone: true,
   imports: [CommonModule],
   selector: 'app-download-item',
   templateUrl: './download-item.component.html',
   styleUrls: ['./download-item.component.scss']
})
export class DownloadItemComponent implements OnInit, OnDestroy {
   @Input('url') url: string = '';
   @Input('fileName') fileName: string = '';
   @Input('fileId') fileId: string = '';
   @Input('options') options: any = null;
   @Output() remove = new EventEmitter<void>();

   file: FileBlobDownload = {} as FileBlobDownload;
   initialFileValue: FileBlobDownload = {
      id: this.fileId,
      fileName: this.fileName,
      url: this.url,
      progressInPercent: 0,
      totalFileSize: 0,
      inProgress: false,
      completed: false,
      hasError: false
   };
   downloadSubs: Subscription = new Subscription();

   intervalId: any;

   constructor(private downloadService: DownloadService) {}

   ngOnInit(): void {
      this.file = this.initialFileValue;
      this.file.id = this.fileId;
      this.file.fileName = this.fileName;
      this.file.url = this.url;
      this.downloadBlobSubscription();
   }

   downloadBlobSubscription() {
      this.downloadSubs = this.downloadService
         .getBlobFile(this.url, this.options)
         .pipe(
            timeout(120000),
            map((event) => {
               let progress = 0;
               if (event.type === HttpEventType.Sent) {
                  this.file.fileName = this.fileName;
                  this.downloadService.putFileToDownloading(this.file);
               } else if (event.type === HttpEventType.DownloadProgress) {
                  let total = event.total ?? 0;
                  progress = Math.round((100 * event.loaded) / total);
                  this.file.fileName = this.fileName;
                  this.file.progressInPercent = progress;
                  this.file.totalFileSize = total;
                  this.file.inProgress = true;
                  this.file.hasError = false;
                  this.file.errorCode = '';
               } else if (event instanceof HttpResponse) {
                  this.file.inProgress = false;
                  this.file.completed = true;
                  this.file.statusCode = event.status;
                  const responseFilename = this.downloadService.getFilenameFromContentDisposition(event.headers.get('Content-Disposition') ?? '');
                  this.file.fileName = responseFilename ? responseFilename : this.file.fileName;
                  if (event.body) this.downloadBlob(event.body, this.file.fileName);
                  this.downloadService.addFileToDownloaded(this.file);
               }
               return event;
            }),
            catchError((e) => {
               this.handleError(LocalConstants.downloadErrorCodeTimeout);
               return EMPTY;
            })
         )
         .subscribe({
            next: (d) => {
               if (!this.intervalId)
                  this.intervalId = setInterval(() => {
                     if (!this.checkActiveConnection()) {
                        this.stopCheckConnection();
                        this.handleError(LocalConstants.downloadErrorCodeConnectionLost);
                     }
                  }, 1000);
            },
            complete: () => {
               this.stopCheckConnection();
            }
         });
   }

   private checkActiveConnection() {
      return window.navigator.onLine;
   }

   private stopCheckConnection() {
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId == null;
         if (this.downloadSubs) this.downloadSubs.unsubscribe();
      }
   }

   private handleError(errorCode = '') {
      this.file.inProgress = false;
      this.file.hasError = true;
      this.file.errorCode = errorCode;
      this.file.progressInPercent = this.file.progressInPercent;
      this.downloadService.putFileToDownloading(this.file);
      this.downloadService.downloadsStatus.next({ isDone: false, withError: true, errorCode: errorCode });
   }

   downloadBlob(blobFile: Blob, filename: string) {
      const data = window.URL.createObjectURL(blobFile);
      var link = document.createElement('a');
      link.href = data;
      link.download = filename;
      link.dispatchEvent(
         new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
         })
      );
      setTimeout(function () {
         window.URL.revokeObjectURL(data);
         link.remove();
      }, 100);
   }

   retryDownload() {
      this.downloadSubs.unsubscribe();
      this.downloadService.downloadsStatus.next({ isDone: false, withError: false, errorCode: '' });
      this.file.hasError = false;
      this.file.inProgress = true;
      this.downloadBlobSubscription();
   }

   removeFile() {
      this.remove.emit();
   }

   removeFileOnService() {
      if (this.file.inProgress || this.file.hasError) this.downloadService.removeFileOnDownloading(this.file);
      if (this.file.completed && !this.file.inProgress) this.downloadService.removeFileOnDownloaded(this.file);
   }

   ngOnDestroy(): void {
      this.removeFileOnService();
      this.downloadSubs.unsubscribe();
   }
}
