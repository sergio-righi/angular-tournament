import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-fab",
  templateUrl: "./fab.component.html",
  styleUrls: ["./fab.component.scss"]
})
export class FabComponent {
  @Input() icon: string = ""; // Default icon
  @Input() tooltip: string = ""; // Tooltip text
  @Input() position: { bottom?: string; right?: string } = { bottom: "20px", right: "20px" }; // Default position
  @Output() onClick = new EventEmitter<void>(); // Event emitter for click action

  onFabClick(): void {
    this.onClick.emit(); // Emit the click event
  }
}
