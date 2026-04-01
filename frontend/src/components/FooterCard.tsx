import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function FooterCard({ children }: Props) {
  return (
    <div className="mx-4 mb-4 rounded-3xl bg-fray-text px-10 py-12">
      {children}
    </div>
  );
}
