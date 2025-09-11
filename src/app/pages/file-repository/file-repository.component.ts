import { Component } from "@angular/core";
import { FileExplorerComponent } from "../../components/file-explorer/file-explorer.component";

@Component({
  selector: 'file-repository-comp',
  templateUrl: 'file-repository.component.html',
  styleUrls: ['file-repository.component.scss'],
  standalone: true,
  imports: [FileExplorerComponent],
})
export class FileRepositoryComponent {}
