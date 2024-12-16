import { Component, ViewChild } from "@angular/core";
import { GridAreaComponent } from "./components/grid-area/grid-area.component";
import { ToolboxComponent } from "./components/toolbox/toolbox.component";

@Component({
  selector: 'workspace-comp',
  templateUrl: 'workspace.component.html',
  styleUrls: ['workspace.component.scss'],
  standalone: true,
  imports: [GridAreaComponent, ToolboxComponent],
})
export class WorkspaceComponent {
  @ViewChild('gridArea') gridArea!: GridAreaComponent;

  // Handles actions triggered from the toolbox
  handleAction(action: string) {
    switch (action) {
      case 'addCsv':
        this.gridArea.addCsvBox();
        break;
      case 'reformCsv':
        this.gridArea.reformCsvBox();
        break;
    }
  }
}