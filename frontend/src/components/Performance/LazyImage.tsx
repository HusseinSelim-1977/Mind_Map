import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
export const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const webpSrc = src.replace(/\.(jpg|png)$/, ".webp") + "?w=800&q=75";
  return (
    <div className={cn("relative overflow-hidden bg-slate-100", className)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
      <img src={webpSrc} alt={alt} loading="lazy" className={cn("transition-opacity duration-slow", loaded ? "opacity-100" : "opacity-0")} onLoad={() => setLoaded(true)} />
    </div>
  );
};
