import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ButtonDirective } from '@coreui/angular';
import { cilArrowRight } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

import { ITreeItem } from "../../file-explorer.module";

@Component({
  selector: 'filetree-item-comp',
  templateUrl: 'filetree-item.component.html',
  styleUrls: ['filetree-item.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonDirective, IconDirective]
})
export class FiletreeItemComponent implements OnChanges {
  @ViewChild('selectButton') selectButton!: ElementRef;

  @Input() item: ITreeItem | null = null;
  @Input() isSelected: boolean = false;

  @Output() onFiletreeItemSelect = new EventEmitter<ITreeItem>();
  @Output() onFiletreeItemUnselect = new EventEmitter<void>();

  icons = { cilArrowRight };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSelected'] && changes['isSelected'].currentValue) {
      (this.selectButton.nativeElement as HTMLButtonElement).focus();
    }
  }

  handlerOnFiletreeItemSelect = (item: ITreeItem) => {
    this.onFiletreeItemSelect.emit(item);
  }

  handlerOnFiletreeItemUnselect = () => {
    this.onFiletreeItemUnselect.emit();
  }
}