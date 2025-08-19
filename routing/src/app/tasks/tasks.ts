import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { TasksService } from './tasks.service';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterLink,
  RouterOutlet,
  RouterState,
  RouterStateSnapshot,
} from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.username());
    console.log(this.message());
  }
  userId = input.required<string>();
  order = input<'asc' | 'desc'>();
  username = input<string>();
  message = input<string>();
  private UserService = inject(TasksService);
  userTasks = computed(() => this.UserService.getUserTasks(this.userId()));
}

export const userNameResolver: ResolveFn<string> = (
  activatedRout: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  return 'resolved';
};
