import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() header: string = ''; // Header text
  @Input() show: boolean = false; // Modal visibility
  @Output() close = new EventEmitter<void>(); // Close event

  onClose(): void {
    this.close.emit(); // Notify parent to close modal
  }
}
