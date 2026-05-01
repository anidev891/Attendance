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
      className="text-xs font-black uppercase tracking-widest"
      classNamePrefix="rs"
      menuPortalTarget={document.body}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '45px',
          borderRadius: '1rem',
          borderColor: state.isFocused ? '#e11d48' : 'var(--card-border)',
          boxShadow: state.isFocused ? '0 0 0 4px rgba(225,29,72,0.1)' : 'none',
          backgroundColor: 'var(--input-bg)',
          transition: 'all 0.3s ease',
          paddingLeft: '8px',
          borderWidth: '1px',
          '&:hover': { borderColor: '#e11d48' },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--card-bg)',
          backdropFilter: 'blur(16px)',
          borderRadius: '1.25rem',
          border: '1px solid var(--card-border)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          zIndex: 9999,
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#e11d48' : state.isFocused ? 'rgba(225,29,72,0.05)' : 'transparent',
          color: state.isSelected ? 'white' : 'var(--text-main)',
          padding: '12px 20px',
          fontSize: '10px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          '&:active': { backgroundColor: '#e11d48' },
        }),
        singleValue: (base) => ({
          ...base,
          color: 'var(--text-main)',
          fontWeight: 900,
        }),
        placeholder: (base) => ({
          ...base,
          color: 'var(--text-muted)',
          fontWeight: 900,
          opacity: 0.5,
        }),
        clearIndicator: (base) => ({
          ...base,
          color: 'var(--text-muted)',
          '&:hover': { color: '#e11d48' },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: 'var(--text-muted)',
          '&:hover': { color: '#e11d48' },
        }),
        indicatorSeparator: () => ({ display: 'none' }),
      }}
      {...props}
    />
  );
}

export type { SearchableSelectOption };
