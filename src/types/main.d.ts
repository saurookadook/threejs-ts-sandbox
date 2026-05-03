export type Nullable<T> = T | null;

export type KeyedObject<V = unknown, K = string> = {
  [key in K]: V;
};

export type ValueOf<T> = T[keyof T];

//-----------------------------------------------------------------------------
// React
//-----------------------------------------------------------------------------
export type ReactCanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;
export type ReactDivProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;
