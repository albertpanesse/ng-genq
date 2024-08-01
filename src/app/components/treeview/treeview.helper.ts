import { TreeNode } from "./treeview.types";

export const addNode = (parentNode: TreeNode, newNode: TreeNode): void => {
  parentNode.children = parentNode.children || [];
  parentNode.children.push(newNode);
}

export const removeNode = (parentNode: TreeNode, nodeId: string): void => {
  parentNode.children =
    parentNode.children?.filter((node) => node.id !== nodeId) || [];
}

export const findNode = (tree: TreeNode[], nodeId: string): TreeNode | null => {
  for (let node of tree) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const found = findNode(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export const replaceNode = (
  tree: TreeNode[] | undefined,
  nodeId: string,
  newNode: TreeNode
): void => {
  if (!tree) return;

  for (let i = 0; i < tree.length; i++) {
    if (tree[i]) {
      if (tree[i].id === nodeId) {
        tree[i] = newNode;
        return;
      }

      if (tree[i].children) {
        replaceNode(tree[i].children, nodeId, newNode);
      }
    }
  }
}
