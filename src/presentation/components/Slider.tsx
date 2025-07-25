import React from 'react';
import clsx from 'clsx';

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  error,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
  id,
  ...props
}) => {
  const sliderId = id || `slider-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={sliderId}
          className="block mb-1 font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={clsx(
          'w-full accent-blue-600',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={!!error}
        aria-describedby={error ? `${sliderId}-error` : undefined}
        {...props}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
      {error && (
        <span id={`${sliderId}-error`} className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
};
