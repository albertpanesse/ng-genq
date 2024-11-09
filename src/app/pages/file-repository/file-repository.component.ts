import { Component } from "@angular/core";
import { FileExplorerModule, EFileType, ITreeItem } from "../../components";

@Component({
  templateUrl: 'file-repository.component.html',
  styleUrls: ['file-repository.component.scss'],
  standalone: true,
  imports: [FileExplorerModule],
})
export class FileRepositoryComponent {
  items: ITreeItem[] = [
    { 
      id: '82374673-820f-4ac4-8b0c-83237fc6a7ba',
      title: 'Sample Directory 1',
      isDir: true,
      fileType: EFileType.NONE,
      fileSize: 0,
      children: [
        { id: 'a6e8ded5-820f-4ac4-8b0c-83237fc6a7ba', title: 'Sample File 6', isDir: false, fileType: EFileType.RAW, fileSize: 2342342, lastUpdate: '2024-02-12T12:20:82Z' },
        { id: 'c366ba1b-0824-4256-81f4-3fbf83459569', title: 'Sample File 7', isDir: false, fileType: EFileType.RAW, fileSize: 453453, lastUpdate: '2024-04-14T12:03:02Z' },
        { id: '35137163-d054-4dc8-ad1e-98afd6f46011', title: 'Sample File 8', isDir: false, fileType: EFileType.RAW, fileSize: 876867, lastUpdate: '2024-06-10T15:05:45Z' },
        { id: '89899bcd-a770-4fc5-9126-6b0d96af0f7d', title: 'Sample File 9', isDir: false, fileType: EFileType.RAW, fileSize: 123123123, lastUpdate: '2024-08-08T18:30:20Z' },
        { id: '8fd5386b-6993-4489-a173-253c48747e15', title: 'Sample File 10', isDir: false, fileType: EFileType.RAW, fileSize: 546564, lastUpdate: '2024-09-02T11:10:11Z' },
      ],
      lastUpdate: '2024-02-12T12:20:82Z' },
    { id: 'a6e8ded5-820f-4ac4-8b0c-83237fc6a7ba', title: 'Sample File 1', isDir: false, fileType: EFileType.RAW, fileSize: 2342342, lastUpdate: '2024-02-12T12:20:82Z' },
    { id: 'c366ba1b-0824-4256-81f4-3fbf83459569', title: 'Sample File 2', isDir: false, fileType: EFileType.RAW, fileSize: 453453, lastUpdate: '2024-04-14T12:03:02Z' },
    { id: '35137163-d054-4dc8-ad1e-98afd6f46011', title: 'Sample File 3', isDir: false, fileType: EFileType.RAW, fileSize: 876867, lastUpdate: '2024-06-10T15:05:45Z' },
    { id: '89899bcd-a770-4fc5-9126-6b0d96af0f7d', title: 'Sample File 4', isDir: false, fileType: EFileType.RAW, fileSize: 123123123, lastUpdate: '2024-08-08T18:30:20Z' },
    { id: '8fd5386b-6993-4489-a173-253c48747e15', title: 'Sample File 5', isDir: false, fileType: EFileType.RAW, fileSize: 546564, lastUpdate: '2024-09-02T11:10:11Z' },
  ];
}