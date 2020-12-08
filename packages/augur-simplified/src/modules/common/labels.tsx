import React from 'react';

interface ValueLabelProps {
    large?: boolean;
    icon?: Object; 
    label?: string;
    sublabel?: string;
    value: number;
}

export const ValueLabel = ({ large, icon, label, sublabel, value }: ValueLabelProps) => {
  return (
    <div>
      <span>
        {label ? label : icon}
        <span>{sublabel}</span>
      </span>
      <span>{value}</span>
    </div>
  );
};
