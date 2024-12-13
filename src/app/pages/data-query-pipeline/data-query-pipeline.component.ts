import { Component } from "@angular/core";
import { WorkspaceComponent } from "../../components/workspace/workspace.component";

@Component({
  selector: 'data-query-pipeline-comp',
  templateUrl: 'data-query-pipeline.component.html',
  styleUrls: ['data-query-pipeline.component.scss'],
  standalone: true,
  imports: [WorkspaceComponent],
})
export class DataQueryPipelineComponent {}