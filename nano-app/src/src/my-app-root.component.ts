import { MyAngular } from '@angular-signals-breakdown/nano-angular';
import { computed, signal } from '@angular-signals-breakdown/nano-signals';

@MyAngular({
  selector: 'nano-signals-app-root',
  style: `
#container {
  max-width: 800px;
  width: 800px;
}
h1 {
  min-width: 100%;
  background-color: yellow;
  color: red;
  font-size: 80px;
}
p {
  max-width: 100%;
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 12px;
}
#buttons {
  min-width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;

  button {
    background-color: darkblue;
    color: aliceblue;
    padding: 20px;
    font-size: 30px;
  }
}`,
  template: `
<div id="container">
  <h1>Hi! {{ fullName() }}</h1>
  <p>(first name: {{ firstName() }}; last name: {{ lastName() }})</p>
  <p>(readonly first name: {{ readOnyFirstName() }})</p>
  <div id="buttons">
   <button (click)="toggleFirstName()">Toggle First Name</button>
   <button (click)="toggleLastName()">Toggle Last Name</button>
  </div>
</div>
`,
})
export class MyAppRootComponent {
  firstNames = ['Paweł', 'Janek'];
  lastNames = ['Twardziak', 'Kowalski'];

  firstName = signal(this.firstNames[0]);
  lastName = signal(this.lastNames[0]);
  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
  readOnyFirstName = this.firstName.asReadonly();

  toggleFirstName() {
    this.firstName.update((value) =>
      value === this.firstNames[0] ? this.firstNames[1] : this.firstNames[0]
    );
  }

  toggleLastName() {
    this.lastName.update((value) =>
      value === this.lastNames[0] ? this.lastNames[1] : this.lastNames[0]
    );
  }
}
