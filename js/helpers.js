// @ts-check
/// <reference path="./types.d.ts" />

/**
 * @template T
 */
export class Maybe {
  /**
   * @param {T} value
   */
  constructor(value) {
    this.value = value;
  }

  /**
   * @template P
   * @param {P} value 
   */
  static of(value) {
    return new Maybe(value);
  }

  /**
   * @template U
   * @param {(value: NonNullable<T>) => U} fn
   */
  bind(fn) {
    return Maybe.of(this.value && fn(this.value));
  }

  /**
   * @template U
   * @param {() => U} fn
   */
  catch(fn) {
    if (!this.value) return Maybe.of(fn());
    return this;
  }

  /**
   * @param {(value: NonNullable<T>) => any} fn 
   */
  do(fn) {
    if (this.value) fn(this.value);
    return this;
  }

  get() {
    return this.value;
  }
}

export function partial(fn, ...apply) {
  return (...args) => fn(...apply, ...args);
}

export function compose(...fns) {
  return (x) => fns.reduceRight((v, f) => f(v) ?? x, x);
}

export function pipe(...fns) {
  return (x) => fns.reduce((v, f) => f(v) ?? x, x);
}

/**
 * 
 * @param {Element} element 
 */
export function getFullHeightOfChildren(element) {
  const rowGap = parseInt(window.getComputedStyle(element).rowGap);
  return Array.from(element.children).reduce(
    (acc, child) => {
      const style = window.getComputedStyle(child);
      const marginTop = parseInt(style.marginTop);
      const marginBottom = parseInt(style.marginBottom);
      const offsetHeight = 'offsetHeight' in child && typeof child.offsetHeight === 'number'
        ? child.offsetHeight : parseInt(style.height);
      return acc + offsetHeight + marginTop + marginBottom;
    }, 0
  ) + (rowGap * (element.children.length - 1));
}

export function toJson(value) {
  try {
    return JSON.stringify(value).replace(/"/g, "'");
  } catch (e) {
    return null;
  }
}

/**
 * 
 * @param {string} value 
 * @returns 
 */
export function sanitize(value) {
  const temp = document.createElement('div');
  temp.textContent = value;
  return temp.innerHTML;
}

/**
 * 
 * @param {TemplateStringsArray} strings 
 * @param  {...any} values 
 */
export function fragment(strings, ...values) {
  const dirty = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
  const template = document.createElement('template');
  template.innerHTML = dirty;
  return template.content;
}