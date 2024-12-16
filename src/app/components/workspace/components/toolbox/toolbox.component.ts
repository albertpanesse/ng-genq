import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'toolbox-comp',
  templateUrl: 'toolbox.component.html',
  styleUrls: ['toolbox.component.scss'],
  standalone: true,
})
export class ToolboxComponent {
  @Output() actionTriggered = new EventEmitter<string>();

  triggerAction(action: string) {
    this.actionTriggered.emit(action);
  }
}