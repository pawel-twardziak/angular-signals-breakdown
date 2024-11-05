import { MyAppRootComponent } from './src/my-app-root.component';
import { bootstrapApplication } from '@angular-signals-breakdown/nano-angular';

(async function () {
  await bootstrapApplication(MyAppRootComponent);
})();
