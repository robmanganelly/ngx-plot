import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <div class="w-screen h-screen flex">
      <!-- vertical navbar with routes -->
      <nav class="bg-gray-800 text-white w-48 min-h-screen p-4">
        <h1 class="text-2xl font-bold mb-6">ngx-plot Demo</h1>
        <ul class="space-y-4">
          <li>
            <a
              routerLink="/capitals"
              routerLinkActive="text-yellow-400"
              class="block px-3 py-2 rounded hover:bg-gray-700"
              >Capitals</a
            >
          </li>
          <li>
            <a
              routerLink="/temperature"
              routerLinkActive="text-yellow-400"
              class="block px-3 py-2 rounded hover:bg-gray-700"
              >Temperature</a
            >
          </li>
        </ul>
      </nav>

      <!-- main content area -->
      <div class="flex-1 p-4">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class App {
  protected title = 'ngx-plot-demo';
}
