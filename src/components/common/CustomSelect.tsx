import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = 'w-[200px]',
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'rounded-full border-black h-9 focus:ring-0 ring-white outline-white',
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className={cn(
              'cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-white border-none'
            )}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
