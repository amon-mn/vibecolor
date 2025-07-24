import React from 'react';
import clsx from 'clsx';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface SelectProps<T = string> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  options: SelectOption<T>[];
}

export function Select<T = string>({
  label,
  error,
  leftIcon,
  rightIcon,
  options,
  className,
  id,
  ...props
}: SelectProps<T>) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block mb-1 font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className={clsx('relative flex items-center', { 'mb-1': error })}>
        {leftIcon && <span className="absolute left-3 text-gray-400">{leftIcon}</span>}
        <select
          id={selectId}
          className={clsx(
            'w-full rounded border px-3 py-2 focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map(opt => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
        {rightIcon && <span className="absolute right-3 text-gray-400">{rightIcon}</span>}
      </div>
      {error && (
        <span id={`${selectId}-error`} className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
} 