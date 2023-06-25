import { PropsWithChildren } from "react";
import { PageMeta } from "../types";

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function MyLayout({ children, meta: pageMeta }: Props) {
  return <main>{children}</main>;
}
