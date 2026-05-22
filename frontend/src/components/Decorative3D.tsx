import { lazy, useEffect, useState } from "react";
export const Decorative3D = lazy(() => import("./Decorative3DContent"));
export default function Decorative3DWrapper() {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isReduced) window.requestIdleCallback(() => setShouldRender(true));
  }, []);
  return shouldRender ? <div className="pointer-events-none fixed inset-0 z-base opacity-20"><Decorative3D /></div> : null;
}
