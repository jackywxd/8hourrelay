import { IAnyStateTreeNode } from "mobx-state-tree";
import { IRootStore } from "./RootStore";

export function isRootStore(node: IAnyStateTreeNode): node is IRootStore {
  return (node as IRootStore).users !== undefined;
}
