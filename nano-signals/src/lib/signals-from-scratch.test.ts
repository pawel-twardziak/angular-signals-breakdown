import { computed, effect, signal, untracked } from './signals-from-scratch';

it('signals should work', () => {
  const myFirstName = signal('Paweł');
  const myLastName = signal('Twardziak');
  const myFirstNameRO = myFirstName.asReadonly();

  console.log('myFirstNameRO()', myFirstNameRO());

  const myFullName = computed(() => `${myFirstName()} ${myLastName()}`);

  // console.log(`First Name: ${myFirstName()}`);
  // console.log(`Last Name: ${myLastName()}`);
  //
  // console.log(`Full Name: ${myFullName()}`);

  // console.log(`First Name: ${myFirstName()}`);
  // console.log(`Last Name: ${myLastName()}`);
  //
  // console.log(`Full Name: ${myFullName()}`);

  effect(() => {
    console.log('Run effect!');
    // createUntracked(myFirstName);
    // myFirstName();
    console.log(`First Name: ${myFirstName()}`);
    // console.log(`First Name: ${}`);
    console.log(`Last Name: ${myLastName()}`);
    untracked(myFullName);
    // myFullName();
    // console.log(`Full Name: ${}`);
  });

  myFirstName.set('Tomasz');

  expect(true).toBeTruthy();
});

/*
import {
  createSignal as signal,
  createEffect as effect,
  createComputed as computed,
  createUntracked as untracked,
} from './signals-from-scratch';
import { blueBright, bgGreenBright, whiteBright } from 'ansi-colors';

const data = [
  {
    firstName: 'Paweł',
    lastName: 'Twardziak',
  },
  {
    firstName: 'Anna',
    lastName: 'Jantar',
  },
  {
    firstName: 'Tom',
    lastName: 'Cruise',
  },
];

(async function () {
  const initialIndex = 0;

  const myFirstName = signal(data[initialIndex].firstName);
  const myLastName = signal(data[initialIndex].lastName);
  const myInitials = computed(() => `${myFirstName()[0]}${myLastName()[0]}`);

  logValue(myFirstName(), myLastName(), myInitials(), initialIndex);

  effect(() => logEffect(myFirstName(), myLastName(), myInitials(), 1));
  effect(() => logEffect(myFirstName(), myLastName(), myInitials(), 2));

  data
    .filter((_, index) => index > initialIndex)
    .forEach((item, index) => {
      logSet('first name', item.firstName, index);
      myFirstName.set(item.firstName);
      logValue(myFirstName(), myLastName(), myInitials(), index);

      logSet('last name', item.lastName, index);
      myLastName.set(item.lastName);
      logValue(myFirstName(), myLastName(), myInitials(), index);
    });
})();

function logSet(
  nameType: 'first name' | 'last name',
  value: string,
  index: number
) {
  console.log(blueBright(`[set ${index}] ${nameType} to: ${value}`));
}
function logValue(
  firstName: string,
  lastName: string,
  computed: string,
  initialIndex: number
) {
  console.log(
    `   ${whiteBright(
      `My full name #${initialIndex}: ${firstName} ${lastName} [computed - ${computed}]`
    )}`
  );
}
function logEffect(
  firstName: string,
  lastName: string,
  computed: string,
  effectIndex: number
) {
  console.log(
    `   ${bgGreenBright(
      `My full name effect #${effectIndex}: ${firstName} ${lastName} [computed - ${computed}]`
    )}`
  );
}

 */
