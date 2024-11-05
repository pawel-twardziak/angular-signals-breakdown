import 'reflect-metadata';
import { NG_SELECTOR_METADATA } from './consts';
import { effect } from '@angular-signals-breakdown/nano-signals';

export function MyAngular(options: {
  selector: string;
  template: string;
  style: string;
  useShadow?: boolean;
}) {
  return <T extends { new (...args: any[]): any }>(constructor: T) => {
    const CustomElement = (function () {
      return class extends HTMLElement {
        #ngComponent = new constructor();
        #template = options.template;
        #ngTemplate = document.createElement('template');
        #ngShadow: ShadowRoot;
        #currentTemplateRendered?: Node;
        #textInterpolationRegExp = new RegExp(
          '{{([a-zA-Z0-9()\\s$_]*?)}}',
          'gm'
        );
        #eventBindingsRegExp = new RegExp(
          '\\(([a-zA-Z0-9.]*?)\\)="[a-zA-Z0-9_]*?\\(\\)"',
          'gm'
        );
        #textInterpolations: RegExpExecArray[] = [];
        #eventBindings: RegExpExecArray[] = [];

        #dynamicTemplate!: () => string;

        #eventListeners = new Map<Element, Map<() => void, string>>();

        componentProxy = new Proxy(this, {
          get: (_, prop, receiver) => {
            return Reflect.get(this.#ngComponent, prop, receiver);
          },
        });

        constructor() {
          super();
          this.#ngShadow = this.attachShadow({ mode: 'open' });
          this.#parseTemplate();
        }

        connectedCallback() {
          console.warn(' AppElement connectedCallback', this);
          effect(() => {
            this.#renderTemplate();
          });
        }

        #textInterpolation() {
          return this.#textInterpolations.reduce(
            (parsedTemplate, textInterpolation) => {
              return parsedTemplate.replaceAll(
                textInterpolation[0],
                `\${this.componentProxy.${textInterpolation[1].replaceAll(
                  /\s/g,
                  ''
                )}}`
              );
            },
            this.#template
          );
        }

        listenToEvents() {
          return this.#eventBindings.forEach((eventBinding) => {
            const eventName = eventBinding[1];
            console.log('eventName', eventName);
            this.#ngShadow
              .querySelectorAll('[\\(click\\)]')
              .forEach((element) => {
                const click = element.getAttribute(`(${eventName})`);
                if (click) {
                  element.removeAttribute(`(${eventName})`);
                  const callback = () =>
                    (this.componentProxy as any)[click.replace('()', '')]();
                  element.addEventListener(eventName, callback);
                  if (!this.#eventListeners.get(element)) {
                    this.#eventListeners.set(element, new Map());
                  }
                  this.#eventListeners.get(element)?.set(callback, eventName);
                }
              });
          });
        }

        #parseTemplate() {
          this.#textInterpolations = Array.from(
            this.#template.matchAll(this.#textInterpolationRegExp)
          );
          this.#eventBindings = Array.from(
            this.#template.matchAll(this.#eventBindingsRegExp)
          );

          this.#dynamicTemplate = new Function(
            `console.log('this', this); return \`${this.#textInterpolation()}\`;`
          ).bind(this) as () => string;
        }

        #renderTemplate() {
          this.#eventListeners.forEach((callbacksMap, element) => {
            Array.from(callbacksMap).forEach((callbackMap) => {
              element.removeEventListener(callbackMap[1], callbackMap[0]);
            });
          });

          if (this.#currentTemplateRendered) {
            this.#ngShadow.innerHTML = '';
          }
          this.#ngTemplate.innerHTML = this.#dynamicTemplate();
          this.#currentTemplateRendered = document.importNode(
            this.#ngTemplate.content,
            true
          );

          const style = document.createElement('style');
          style.textContent = options.style ?? '';

          this.#ngShadow.appendChild(style);
          this.#ngShadow.appendChild(this.#currentTemplateRendered);

          this.listenToEvents();
        }
      };
    })();
    // Object.setPrototypeOf(CustomElement.prototype, constructor.prototype);
    Reflect.defineMetadata(
      NG_SELECTOR_METADATA,
      options.selector,
      CustomElement
    );

    console.log('constructor', constructor);
    console.log('options', options);

    return CustomElement as T;
  };
}
