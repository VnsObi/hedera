import React from 'react'
import { twMerge } from 'tailwind-merge'

export function cls(framesTree: Record<string, any> | undefined, name: string, className: string): string {
  if (framesTree?.[name]?.className) {
    return (
      twMerge(className, framesTree[name]?.className)
    );
  }
  return className;
}

function mergeDeep(target: any, ...sources: any[]) {
  function isObject(item: any) {
    return item && typeof item === "object" && !Array.isArray(item);
  }
  function isReactObject(source: any): boolean {
    return source.$$typeof != null;
  }

  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source) && !isReactObject(source)) {
    for (const key in source) {
      if (isObject(source[key]) && !isReactObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

export function combine<OverrideType>(...arr: OverrideType[]): OverrideType {
  return arr.reduce((res, cur) => mergeDeep(res, cur), {} as OverrideType);
}

type AllowedTags = "div" | "span" | "svg" | "img" | "button" | "a" | "input" | "textarea" | "select" | "option" | "form" | "label" | "p" | "h1" | "h2" | "h3" | "h4";

export type ElementProps<T extends keyof JSX.IntrinsicElements> = Omit<JSX.IntrinsicElements[T], "content"> & {
  replace?: JSX.Element | string | null;
  content?: JSX.Element | string | null;
  as?: AllowedTags
}
export type SpanProps = ElementProps<"span">;
export type DivProps = ElementProps<"div">;
export function Element(props: ElementProps<AllowedTags> & Required<Pick<ElementProps<AllowedTags>, "as">>): JSX.Element {
  const { replace, content, as, ...rest } = props;

  if (replace !== undefined) {
    return replace as any;
  }
  if (content !== undefined) {
    return Element({ ...rest, as, children: content });
  }
  return React.createElement(as, props);
}
export function Div(props: ElementProps<"div">) {
  return <Element as="div" {...props} />;
}
export function Span(props: ElementProps<"span">) {
  return <Element as="span" {...props} />;
}
export type SvgProps = ElementProps<"svg">;
export function Svg(props: ElementProps<"svg">) {
  return <Element as="svg" {...props} />;
}

export type ImgProps = ElementProps<"img">;
export function Img(props: ElementProps<"img">) {
  return <Element as="img" {...props} />;
}

export function HtmlButton(props: ElementProps<"button">) {
  return <Element as="button" {...props} />;
}
export function HtmlA(props: ElementProps<"a">) {
  return <Element as="a" {...props} />;
}
export function HtmlInput(props: ElementProps<"input">) {
  return <Element as="input" {...props} />;
}
export function HtmlTextarea(props: ElementProps<"textarea">) {
  return <Element as="textarea" {...props} />;
}
export function HtmlSelect(props: ElementProps<"select">) {
  return <Element as="select" {...props} />;
}
export function HtmlOption(props: ElementProps<"option">) {
  return <Element as="option" {...props} />;
}
export function HtmlForm(props: ElementProps<"form">) {
  return <Element as="form" {...props} />;
}
export function HtmlLabel(props: ElementProps<"label">) {
  return <Element as="label" {...props} />;
}
export function HtmlP(props: ElementProps<"p">) {
  return <Element as="p" {...props} />;
}
export function HtmlH1(props: ElementProps<"h1">) {
  return <Element as="h1" {...props} />;
}
export function HtmlH2(props: ElementProps<"h2">) {
  return <Element as="h2" {...props} />;
}
export function HtmlH3(props: ElementProps<"h3">) {
  return <Element as="h3" {...props} />;
}
export function HtmlH4(props: ElementProps<"h4">) {
  return <Element as="h4" {...props} />;
}

