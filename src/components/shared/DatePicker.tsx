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
      className={`w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red/50 transition-all ${className}`}
      popperClassName="z-[9999]"
      popperPlacement="bottom-start"
      portalId="root"
    />
  );
}
