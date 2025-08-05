import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-addtask',
  imports: [FormsModule],
  templateUrl: './addtask.html',
  styleUrl: './addtask.css',
})
export class Addtask {
  @Output() closeForm = new EventEmitter<void>();
  @Input({ required: true }) userId!: string;
  inputTitle = signal('');
  inputDescription = signal('');
  inputDate = signal('');
  private taskService = inject(TasksService);

  onClickingCancel() {
    this.closeForm.emit();
  }

  onSubmit() {
    this.taskService.addTask(
      {
        title: this.inputTitle(),
        description: this.inputDescription(),
        dueDate: this.inputDate(),
      },
      this.userId
    );
    this.closeForm.emit();
  }
}
