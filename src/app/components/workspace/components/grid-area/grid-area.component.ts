import { Component, ElementRef, ViewChild } from "@angular/core";
import { GridStack } from 'gridstack';
import 'gridstack/dist/es5/gridstack';
declare const LeaderLine: any;

@Component({
  selector: 'grid-area-comp',
  templateUrl: 'grid-area.component.html',
  styleUrls: ['grid-area.component.scss'],
  standalone: true,
})
export class GridAreaComponent {
  @ViewChild('gridContainer') gridContainer!: ElementRef;

  private grid!: GridStack;
  private leaderLines: { from: HTMLElement; to: HTMLElement; line: any }[] = [];

  ngAfterViewInit(): void {
    // Initialize GridStack
    this.grid = GridStack.init({}, this.gridContainer.nativeElement);
  }

  // Add a CSV Box
  addCsvBox() {
    const box = this.createBox('CSV File');
    this.grid.addWidget(box);
  }

  // Reform CSV Box
  reformCsvBox() {
    const box = this.createBox('Reformed CSV');
    this.grid.addWidget(box);
  }

  // Create a box element
  private createBox(content: string): HTMLElement {
    const box = document.createElement('div');
    box.className = 'grid-stack-item';
    box.innerHTML = `
      <div class="grid-stack-item-content">
        ${content}
        <button class="connect-btn">Connect</button>
      </div>
    `;

    // Add connection logic
    box.querySelector('.connect-btn')?.addEventListener('click', () => {
      this.connectBoxes(box);
    });

    return box;
  }

  // Connect boxes with LeaderLine
  private connectBoxes(fromBox: HTMLElement) {
    const toBox = this.gridContainer.nativeElement.querySelector(
      '.grid-stack-item:last-child'
    ) as HTMLElement;

    if (toBox && fromBox !== toBox) {
      const line = new LeaderLine(
        LeaderLine.pointAnchor(fromBox),
        LeaderLine.pointAnchor(toBox)
      );

      this.leaderLines.push({ from: fromBox, to: toBox, line });
    }
  }
}