import { NG_SELECTOR_METADATA } from './consts';

export async function bootstrapApplication(component: any) {
  const selector = Reflect.getMetadata(NG_SELECTOR_METADATA, component);
  console.log('selector', selector);
  console.log('MyAppRootComponent', component);
  customElements.define(
    selector,
    component as unknown as CustomElementConstructor
  );
}
