import React from 'react';

export function Toast({
  message,
  type = 'success',
  show,
}: {
  message: string;
  type?: 'success' | 'error';
  show: boolean;
}) {
  if (!show) return null;
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold text-base transition-all duration-300
      ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} animate-fadein`}
    >
      {message}
    </div>
  );
}
