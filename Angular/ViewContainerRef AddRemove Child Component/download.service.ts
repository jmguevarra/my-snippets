import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ApiUrl } from '../shared/api-url';
import { FileBlobDownload } from '../shared/models/file/blob-download.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private _downloading: FileBlobDownload[] = [];
  private _downloaded: FileBlobDownload[] = [];
  fileQueueSubj: BehaviorSubject<{url: string, fileName: string}> = new BehaviorSubject<{url: string, fileName: string}>({url: '', fileName: ''});
  downloadsIsDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(private httpClient: HttpClient, private apiUrl : ApiUrl) {}

  generateFileId(): string {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000).toString();
    return timestamp + '-' + randomNum;
  }

  queueFile(url: string, fileName: string = ''){
    if(!url) return;
    this.fileQueueSubj.next({
      url: url,
      fileName: fileName
    });
    this.downloadsIsDone.next(false);
  }

  addFileToDownloading(file: FileBlobDownload){
    if(!file) return;
    const fileIndex = this._downloading.findIndex(f => f.id === file.id);
    if(fileIndex === -1) this._downloading.push(file);
  }

  removeFileOnDownloading(file: FileBlobDownload){
    if(!file) return;
    const fileIndex = this._downloading.findIndex(f => f.id === file.id);
    if(fileIndex >= 0) this._downloading.splice(fileIndex, 1);
  }

  addFileToDownloaded(file: FileBlobDownload){
    if(!file) return;
    const fileIndex = this._downloaded.findIndex(f => f.id === file.id);
    if(fileIndex === -1){
      this.removeFileOnDownloading(file);
      if(this._downloading.length === 0) this.downloadsIsDone.next(true);
      this._downloaded.push(file);
    }
  }
  
  removeFileOnDownloaded(file: FileBlobDownload){
    if(!file) return;
    const fileIndex = this._downloaded.findIndex(f => f.id === file.id);
    if(fileIndex >= 0) this._downloaded.splice(fileIndex, 1);
  }

  ngOnDestroy(): void {
    this._downloaded = [];
    this._downloading = [];
  }
  
  getBlobFile(url: string): Observable<any>{
    return this.httpClient.get(url, {observe: 'events', reportProgress: true, responseType: 'blob' });
  }

  getFilenameFromContentDisposition(contentDisposition: string): string {
    const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\n]*)['"]?/;
    const matches = filenameRegex.exec(contentDisposition);
    console.log(contentDisposition, 'ee');
    if (matches != null && matches[1]) {
      console.log(matches[1].replace(/['"]/g, ''), contentDisposition, 'sss');
      return matches[1].replace(/['"]/g, '');
    }
    return '';
  }
  
  //Static Endpoints
  downloadOfferAcceptanceDocument(id: string, isDma: boolean, isTermsAndCondition: boolean, fileType: string){
    const url =  this.apiUrl.reportsDownloadOfferAcceptance + `?opportunityId=${id}&isDMA=${isDma}&isTermsAndCondition=${isTermsAndCondition}&fileType=${fileType}`;
    return this.httpClient.get<any>(url);
  }

  downloadFileByFileId(id: number){
    const url =  this.apiUrl.downloadFileByFileId + `?fileid=${id}`;
    return this.httpClient.get<any>(url);
  }

  downloadFileByFileIdAndOppId(fileId: number, oppId: string, docType: string){
    const url =  this.apiUrl.downloadFileByFileIdAndOppId + `?fileid=${fileId}&oppId=${oppId}&docType=${docType}`;
    return this.httpClient.get<any>(url);
  }

  downloadTermsAndAgreement(oppId: string, formId: number, fileType: string){
    const url =  this.apiUrl.reportsDownloadAgreementForm + `?opportunityId=${oppId}&formId=${formId}&fileType=${fileType}`;
    return this.httpClient.get<any>(url);
  }

  downloadAttachmentByFileId(id: number){
    const url =  this.apiUrl.downloadAttachmentByFileId + `?fileid=${id}`;
    return this.httpClient.get<any>(url);
  }
}
