import { Injectable } from "@angular/core";
import { ModalComponent } from "../../components/modals";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root',
})
export class DialogModalService {
  private modals: NgbModalRef[] = [];
  private lastIndex: number = 0;

  constructor(private modalService: NgbModal) {}

  openModal(modal: ModalComponent): number {
    this.lastIndex++;

    this.modals[this.lastIndex] = this.modalService.open(modal, {

    });

    return this.lastIndex;
  }

  closeModal(id: number) {
    this.modals[id].close();
  }

  openProgress() {}

  closeProgress() {}
}
