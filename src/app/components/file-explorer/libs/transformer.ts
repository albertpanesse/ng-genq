import { IUserFile } from "../../../libs/types";
import { EFileType, IFileItem, ITreeItem } from "./types";

function transformUserFilesToTree(userFiles: IUserFile[]): ITreeItem[] {
  const userFileMap: Map<number, IUserFile[]> = new Map();
  const rootItems: ITreeItem[] = [];

  // Categorize files by parentId
  userFiles.forEach((file) => {
    if (!userFileMap.has(file.parentId)) {
      userFileMap.set(file.parentId, []);
    }
    userFileMap.get(file.parentId)!.push(file);
  });

  // Recursively create tree items
  function createTreeItems(parentId: number): ITreeItem[] {
    const items = userFileMap.get(parentId) || [];
    return items.map((file) => {
      const fileType = determineFileType(file.fileName);

      const fileItem: IFileItem = {
        id: file.id.toString(),
        title: file.title,
        isDir: file.isDir,
        fileType,
        fileSize: 0, // Adjust if you have file size information
        children: [],
        lastUpdate: new Date().toISOString(), // Use actual date if available
      };

      const treeItem: ITreeItem = {
        fileItem,
        isExpanded: false,
        isOpened: false,
      };

      // Recursively build children if the item is a directory
      if (file.isDir) {
        fileItem.children = createTreeItems(file.id);
      }

      return treeItem;
    });
  }

  // Build the root-level items
  rootItems.push(...createTreeItems(0)); // Assuming `0` represents the root parentId

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

export { transformUserFilesToTree };
