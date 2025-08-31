import React from "react";

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  labelClass: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, labelClass }) => (
  <div className="flex items-center justify-between gap-3 py-2.5">
    <span className={`text-[11px] uppercase tracking-[0.15em] ${labelClass}`}>
      {label}
    </span>
    <span className="text-sm">{value}</span>
  </div>
);

export default InfoRow;
