import { IUserFile } from "../../../libs/types";
import { EFileType, IFileItem, ITreeItem } from "./types";

function transformUserFileToFileItem(userFile: IUserFile): IFileItem {
  // const fileType = determineFileType(file.fileName);
  const fileType = EFileType.NONE;

  const fileItem: IFileItem = {
    id: userFile.id.toString(),
    title: userFile.title,
    isDir: userFile.isDir,
    fileType,
    fileSize: 0,
    children: [],
    lastUpdate: new Date().toISOString(),
  };

  return fileItem;
}

function transformUserFilesToTree(userFiles: IUserFile[]): ITreeItem[] {
  const userFileMap: Map<number, IUserFile[]> = new Map();
  const rootItems: ITreeItem[] = [];

  userFiles.forEach((file) => {
    if (!userFileMap.has(file.parentId)) {
      userFileMap.set(file.parentId, []);
    }
    userFileMap.get(file.parentId)!.push(file);
  });

  function createTreeItems(parentId: number): ITreeItem[] {
    const items = userFileMap.get(parentId) || [];

    const treeItems = items.map((file) => {
      const fileItem = transformUserFileToFileItem(file);

      if (file.isDir) {
        fileItem.children = createTreeItems(file.id);
      }

      const treeItem: ITreeItem = {
        fileItem,
        isExpanded: file.id == 1,
        isOpened: file.id == 1,
      };

      return treeItem;
    });

    return treeItems;
  }

  rootItems.push(...createTreeItems(-1));

  return rootItems;
}

function determineFileType(fileName: string): EFileType {
  if (fileName.endsWith('.csv.gz')) {
    return EFileType.CSVGZ;
  } else if (fileName.endsWith('.csv')) {
    return EFileType.CSV;
  } else if (fileName.endsWith('.gz')) {
    return EFileType.GZ;
  } else if (fileName) {
    return EFileType.RAW;
  } else {
    return EFileType.NONE;
  }
}

export { transformUserFileToFileItem, transformUserFilesToTree };
