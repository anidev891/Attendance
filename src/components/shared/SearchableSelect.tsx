import Select, { type Props as SelectProps } from 'react-select';

interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps extends Omit<SelectProps<SearchableSelectOption, false>, 'options'> {
  options: SearchableSelectOption[];
  placeholder?: string;
}

export default function SearchableSelect({ options, placeholder = 'Select...', ...props }: SearchableSelectProps) {
  return (
    <Select<SearchableSelectOption, false>
      options={options}
      placeholder={placeholder}
      isSearchable
      isClearable
      className="text-sm"
      classNamePrefix="rs"
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '42px',
          borderRadius: '0.75rem',
          borderColor: state.isFocused ? '#10b981' : '#e2e8f0',
          boxShadow: state.isFocused ? '0 0 0 2px rgba(16,185,129,0.25)' : 'none',
          '&:hover': { borderColor: '#10b981' },
          backgroundColor: '#f8fafc',
        }),
        menu: (base) => ({
          ...base,
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          zIndex: 50,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white',
          color: state.isSelected ? 'white' : '#1e293b',
          '&:hover': { backgroundColor: state.isSelected ? '#059669' : '#f0fdf4' },
        }),
        placeholder: (base) => ({ ...base, color: '#94a3b8' }),
        clearIndicator: (base) => ({ ...base, color: '#94a3b8', '&:hover': { color: '#64748b' } }),
        dropdownIndicator: (base) => ({ ...base, color: '#94a3b8', '&:hover': { color: '#64748b' } }),
      }}
      {...props}
    />
  );
}

export type { SearchableSelectOption };
