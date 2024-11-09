import { Component, Input } from "@angular/core";
import { ITreeItem } from "../../file-explorer.module";

@Component({
  selector: 'filetree-item-comp',
  templateUrl: 'filetree-item.component.html',
  styleUrls: ['filetree-item.component.scss'],
  standalone: true,
})
export class FiletreeItemComponent {
  @Input() item: ITreeItem | null = null;
}