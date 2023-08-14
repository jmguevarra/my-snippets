import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../shared/api-url';
import { FileBlobDownload } from '../shared/models/file/blob-download.model';
import { BehaviorSubject, Observable,} from 'rxjs';
import { LocalConstants } from '../shared/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CloseConfirmationComponent } from '../modal/close-confirmation/close-confirmation.component';

@Injectable({
   providedIn: 'root'
})
export class DownloadService implements OnDestroy {
   private _downloading: FileBlobDownload[] = [];
   private _downloaded: FileBlobDownload[] = [];
   fileQueueSubj: BehaviorSubject<{ url: string; fileName: string; options: any }> = new BehaviorSubject<{ url: string; fileName: string; options: any }>({ url: '', fileName: '', options: null });
   downloadsStatus: BehaviorSubject<{ isDone: boolean; withError: boolean, errorCode: string }> = new BehaviorSubject<{ isDone: boolean; withError: boolean, errorCode: string }>({ isDone: false, withError: false, errorCode: '' });
   cancelledDownloads: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   downloadPanelIsOpen: boolean = false;
   readonly maxDownloadingItem: number = 10;
   private _queuedFiles: { url: string; fileName: string; options: any }[] = [];

   constructor(
      private httpClient: HttpClient, 
      private apiUrl: ApiUrl,
      private modalService: NgbModal, 
   ) {}
   
   generateFileId(): string {
      const timestamp = Date.now().toString();
      const randomNum = Math.floor(Math.random() * 10000).toString();
      return timestamp + '-' + randomNum;
   }

   queueFile(url: string, fileName: string = '', options: any = null) {
      if (!url) return;

      setTimeout(()=>{
         this.fileQueueSubj.next({
            url: url,
            fileName: fileName,
            options: options
         });
         this.downloadsStatus.next({ isDone: false, withError: false, errorCode: '' });
      }, 500);
   }

   putFileToDownloading(file: FileBlobDownload) {
      if (!file) return;

      const fileIndex = this._downloading.findIndex((f) => f.id === file.id);
      if(fileIndex >= 0) this._downloading[fileIndex] = file;
      if(fileIndex === -1) this._downloading.push(file);
   }

   removeFileOnDownloading(file: FileBlobDownload) {
      if (!file) return;
      const fileIndex = this._downloading.findIndex((f) => f.id === file.id);
      if (fileIndex >= 0) this._downloading.splice(fileIndex, 1);
   }

   addFileToDownloaded(file: FileBlobDownload) {
      if (!file) return;

      const fileIndex = this._downloaded.findIndex((f) => f.id === file.id);
      if (fileIndex === -1) {
         this.removeFileOnDownloading(file);
         this._downloaded.push(file);

         if(this._downloading.length < this.maxDownloadingItem && this._queuedFiles.length > 0){
            const fileToDownload = this._queuedFiles[0];
            this.queueFile(fileToDownload.url, fileToDownload.fileName, fileToDownload.options);
            this._queuedFiles.shift();
            return;
         } 

         if (this._downloading.length === 0 && this._queuedFiles.length === 0){
            this.downloadsStatus.next({ isDone: true, withError: false, errorCode: '' });
            return;
         }

         //check if there's still unfinish download with error
         const _downloadingWithError = this._downloading.filter(i => i.hasError && !i.completed);
         if(this._downloading.length > 0 && _downloadingWithError.length > 0){
            const errorCode = _downloadingWithError[0].errorCode;
            this.downloadsStatus.next({ isDone: false, withError: true, errorCode: errorCode ?? '' });
            return
         }
      }
   }

   removeFileOnDownloaded(file: FileBlobDownload) {
      if (!file) return;
      const fileIndex = this._downloaded.findIndex((f) => f.id === file.id);
      if (fileIndex >= 0) this._downloaded.splice(fileIndex, 1);
   }

   getBlobFile(url: string, options: any = null): Observable<any> {
      if (options) return this.httpClient.post(url, options, { observe: 'events', reportProgress: true, responseType: 'blob' });
      return this.httpClient.get(url, { observe: 'events', reportProgress: true, responseType: 'blob' });
   }

   getFilenameFromContentDisposition(contentDisposition: string): string {
      const filenameRegex = /filename\*?=(?:(?:"([^"]+)")|([^;\n\r]+))/i;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches && matches.length > 1){
         const encodedFilename = matches[1] || matches[2];
         return decodeURI(encodedFilename);
      }
      return '';
   }

   setQueuedFiles(data: { url: string; fileName: string; options: any }){
      if(!data.url) return;
      this._queuedFiles.push(data);
   }

   allDownloadsIsDone(): boolean{
      return this._downloading.length < 1 ? true : false;
   }

   currentDownloadingItem(): number{
      return this._downloading.length;
   }

   cancelAllDownloads(){
      if(this._downloading.length < 1) return;
      const modalRef = this.modalService.open(CloseConfirmationComponent, {
         windowClass: 'exitModal',
         centered: true,
         size: 'xxs'
      });
      modalRef.componentInstance.modalTitle = LocalConstants.cancelDownloadsTitle;
      modalRef.componentInstance.modalDescription = LocalConstants.cancelDownloadsContent;
      modalRef.componentInstance.modalButtonYes = 'Yes';
      modalRef.componentInstance.modalButtonNo = 'No';
      modalRef.componentInstance.isClosed.subscribe((confirmation: boolean) => this.cancelledDownloads.next(confirmation));
   }


   //Static Endpoints
   downloadOfferAcceptanceDocument(id: string, isDma: boolean, isTermsAndCondition: boolean, fileType: string) {
      const url = this.apiUrl.reportsDownloadOfferAcceptance + `?opportunityId=${id}&isDMA=${isDma}&isTermsAndCondition=${isTermsAndCondition}&fileType=${fileType}`;
      return this.httpClient.get<any>(url);
   }

   downloadFileByFileId(id: number) {
      const url = this.apiUrl.downloadFileByFileId + `?fileid=${id}`;
      return this.httpClient.get<any>(url);
   }

   downloadFileByFileIdAndOppId(fileId: number, oppId: string, docType: string) {
      const url = this.apiUrl.downloadFileByFileIdAndOppId + `?fileid=${fileId}&oppId=${oppId}&docType=${docType}`;
      return this.httpClient.get<any>(url);
   }

   downloadTermsAndAgreement(oppId: string, formId: number, fileType: string) {
      const url = this.apiUrl.reportsDownloadAgreementForm + `?opportunityId=${oppId}&formId=${formId}&fileType=${fileType}`;
      return this.httpClient.get<any>(url);
   }

   downloadAttachmentByFileId(id: number) {
      const url = this.apiUrl.downloadAttachmentByFileId + `?fileid=${id}`;
      return this.httpClient.get<any>(url);
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

   ngOnDestroy(): void {
      this._downloaded = [];
      this._downloading = [];
      this.downloadPanelIsOpen = false;
   }
}
