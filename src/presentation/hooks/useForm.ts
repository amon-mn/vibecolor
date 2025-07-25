import { useState } from 'react';

export function useForm<T extends Record<string, any>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setValues(v => ({
      ...v,
      [name]: fieldValue,
    }));
  };
  const setField = (name: keyof T, value: any) =>
    setValues(v => ({ ...v, [name]: value }));
  return { values, setValues, handleChange, setField };
}
