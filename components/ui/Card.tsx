import React from "react";

interface CardProps {
  title?: string;
  right?: React.ReactNode;
  className?: string;
  themeClass: string;
  headerDivider: string;
  titleClass: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  right,
  className = "",
  themeClass,
  headerDivider,
  titleClass,
  children,
}) => (
  <div
    className={`rounded-3xl border ring-1 shadow-2xl shadow-black/40 backdrop-blur-xl ${themeClass} ${className}`}
  >
    {(title || right) && (
      <div
        className={`flex items-center justify-between gap-3 px-6 py-4 border-b ${headerDivider}`}
      >
        {title && (
          <span
            className={`text-[13px] font-semibold tracking-wider uppercase ${titleClass}`}
          >
            {title}
          </span>
        )}
        {right}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Card;
