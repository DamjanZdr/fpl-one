import React from "react";

interface FieldBoxProps {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  boxClass: string;
  labelClass: string;
  valueClass: string;
}

const FieldBox: React.FC<FieldBoxProps> = ({
  label,
  value,
  icon,
  boxClass,
  labelClass,
  valueClass,
}) => (
  <div className={`rounded-xl p-4 ring-1 ${boxClass}`}>
    <div className="flex items-center gap-2">
      {icon}
      <span className={`text-[11px] uppercase tracking-[0.15em] ${labelClass}`}>
        {label}
      </span>
    </div>
    <div className={`mt-1 text-[15px] font-medium ${valueClass}`}>
      {value ?? <span className="text-gray-500">-</span>}
    </div>
  </div>
);

export default FieldBox;
