import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-close-confirmation',
  templateUrl: './close-confirmation.component.html',
  styleUrls: ['./close-confirmation.component.scss'],
})
export class CloseConfirmationComponent implements OnInit {
  @Output() isClosed: EventEmitter<boolean> = new EventEmitter();
  modalTitle: string = 'Are you sure you want to leave without saving <br> your progress?';
  modalDescription: string = 'Any unsaved changes will be discarded.';
  modalButtonYes: string = 'Yes, leave this page';
  modalButtonNo: string = 'No, stay on this page';

  constructor(
    private modalService: NgbModal,
    private activeModalService: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  closeAll() {
    this.modalService.dismissAll();
  }
  closeYes() {
    this.isClosed.emit(true);
    this.activeModalService.close();
  }
  closeNo() {
    this.isClosed.emit(false);
    this.activeModalService.close();
  }

  closeCurrentModal() {
    this.activeModalService.close();
  }
}
