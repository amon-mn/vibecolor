import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-1 font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className={clsx('relative flex items-center', { 'mb-1': error })}>
          {leftIcon && <span className="absolute left-3 text-gray-400">{leftIcon}</span>}
          <input
            id={inputId}
            ref={ref}
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
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 text-gray-400">{rightIcon}</span>}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input'; 