import { Component, OnInit } from "@angular/core";
import { FileExplorerModule, EFileType, ITreeItem } from "../../components";
import { FileManagerService } from "src/app/libs/services";

@Component({
  selector: 'file-repository-comp',
  templateUrl: 'file-repository.component.html',
  styleUrls: ['file-repository.component.scss'],
  standalone: true,
  imports: [FileExplorerModule],
})
export class FileRepositoryComponent implements OnInit {
  items: ITreeItem[] = [];

  constructor(private fileManagerService: FileManagerService) {}

  ngOnInit(): void {
    this.fileManagerService.getList();
  }
}