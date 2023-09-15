import { Uri, TreeItem, TreeDataProvider, TreeItemCollapsibleState, ThemeIcon } from 'vscode';

export class TodoTreeDataProvider implements TreeDataProvider<Dependency> {
  static viewId = 'hello-world-svelte.todoTreeView';

  constructor(private extensionUri: Uri) {}

  getTreeItem(element: Dependency): TreeItem {
    return element;
  }

  async getChildren(element?: Dependency): Promise<Dependency[]> {
    if (element) {
      return [];
    } else {
      return ['one', 'two', 'three'].map((label) => new Dependency(label, TreeItemCollapsibleState.None, this.extensionUri));
    }
  }
}

class Dependency extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    extensionUri: Uri,
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = this.label + ' hmmm?';
    this.iconPath = new ThemeIcon('activate-breakpoints');
    // this.iconPath = {
    //   light: Uri.joinPath(extensionUri, 'resources/light/dependency.svg'),
    //   dark: Uri.joinPath(extensionUri, 'resources/dark/dependency.svg'),
    // };
  }
}
