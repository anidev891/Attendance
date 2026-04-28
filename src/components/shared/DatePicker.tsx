import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  isClearable?: boolean;
  className?: string;
}

export default function DatePicker({ selected, onChange, placeholderText = 'Select date', isClearable = true, className = '' }: DatePickerProps) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="dd-MM-yyyy"
      placeholderText={placeholderText}
      isClearable={isClearable}
      className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all ${className}`}
      popperClassName="z-50"
      popperPlacement="bottom-start"
    />
  );
}
