import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';

import { IUserFile } from "../../../libs/types";
import { EFileType, IFileItem, ITreeItem } from "./types";

function transformUserFileToFileItem(userFile: IUserFile): IFileItem {
  const fileItem: IFileItem = {
    createdAt: userFile.createdAt,
    fileName: userFile.fileName,
    userFileId: userFile.id,
    id: uuidv4(),
    isDir: userFile.isDir,
    parentId: userFile.parentId,
    groupId: md5(userFile.parentId.toString()),
    title: userFile.title,
    updatedAt: userFile.updatedAt,
    userId: userFile.userId,
    fileType: determineFileType(userFile.fileName),
    fileSize: 0,
    children: [],
  };

  return fileItem;
}

function transformUserFilesToTree(userFiles: IUserFile[]): ITreeItem[] {
  const userFileMap: Map<string, IUserFile[]> = new Map();
  const rootItems: ITreeItem[] = [];

  userFiles.forEach((file: IUserFile) => {
    if (!userFileMap.has(md5(file.parentId.toString()))) {
      userFileMap.set(md5(file.parentId.toString()), []);
    }
    userFileMap.get(md5(file.parentId.toString()))!.push(file);
  });

  function createTreeItems(groupId: string): ITreeItem[] {
    const items = userFileMap.get(groupId) || [];

    const treeItems = items.map((file) => {
      const fileItem = transformUserFileToFileItem(file);

      if (file.isDir) {
        fileItem.children = createTreeItems(md5(file.id.toString()));
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

  rootItems.push(...createTreeItems(md5('-1')));

  return rootItems;
}

function determineFileType(fileName: string): EFileType {
  if (fileName?.endsWith('.csv.gz')) {
    return EFileType.CSVGZ;
  } else if (fileName?.endsWith('.csv')) {
    return EFileType.CSV;
  } else if (fileName?.endsWith('.gz')) {
    return EFileType.GZ;
  } else if (fileName) {
    return EFileType.RAW;
  } else {
    return EFileType.NONE;
  }
}

export { transformUserFileToFileItem, transformUserFilesToTree };
