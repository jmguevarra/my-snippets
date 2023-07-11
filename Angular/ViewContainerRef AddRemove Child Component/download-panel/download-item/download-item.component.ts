import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { FileBlobDownload } from '../../models/file/blob-download.model';
import { Subscription, map, retry } from 'rxjs';
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
    hasError: false,
  };
  downloadSubs: Subscription = new Subscription();
  
  constructor(private downloadService: DownloadService) { }

  ngOnInit(): void {
    this.file = this.initialFileValue;
    this.downloadBlobSubscription();
  }

  downloadBlobSubscription(isRetry: boolean = false){
    this.downloadSubs = this.downloadService.getBlobFile(this.url).pipe(map(event => {
      let progress = 0;
      if(event.type === HttpEventType.Sent){
        this.downloadService.addFileToDownloading(this.file);
        this.file.fileName =  LocalConstants.downloadPleaseWait;
        if(isRetry){
          this.file.progressInPercent = 0;
          this.file.hasError = false;
        }
      }else if(event.type === HttpEventType.DownloadProgress){
        let total = event.total ?? 0;
        progress = Math.round(100 * event.loaded / total);
        this.file.fileName = this.fileName;
        this.file.progressInPercent = progress;
        this.file.totalFileSize = total;
        this.file.inProgress = true;
      }else if(event instanceof HttpResponse){
        this.file.inProgress = false;
        this.file.completed = true;
        this.file.statusCode = event.status;
        if(event.body) this.downloadBlob(event.body, this.file.fileName);
        this.downloadService.addFileToDownloaded(this.file)
      }else{
        //console.log(event, "error-http");
      }
      return event;
    })).subscribe({
      error: ()=>{
        const isOnline = navigator.onLine;
        if(!isOnline){
          this.file.inProgress = false;
          this.file.hasError = true;
          this.file.progressInPercent = 100;
        }
      }
    });
  }

  downloadBlob(blobFile: Blob, filename: string){
    const data = window.URL.createObjectURL(blobFile);
    var link = document.createElement('a');
    link.href = data;
    link.download = filename;
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    setTimeout(function () {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  retryDownload(){
    this.downloadSubs.unsubscribe();
    this.removeFileOnService();
    this.file = this.initialFileValue;
    this.downloadBlobSubscription(true);
  }

  removeFile(){ 
    this.removeFileOnService();
    this.remove.emit();
  }

  removeFileOnService(){
    if(this.file.inProgress || this.file.hasError) this.downloadService.removeFileOnDownloading(this.file);
    if(this.file.completed && !this.file.inProgress) this.downloadService.removeFileOnDownloaded(this.file);
  }

  ngOnDestroy(): void {
    this.removeFileOnService()
    this.downloadSubs.unsubscribe();
  }

}
