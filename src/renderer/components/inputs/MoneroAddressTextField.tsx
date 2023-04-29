import { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { isjudeAddressValid } from '../../../utils/currencyUtils';
import { isTestnet } from '../../../store/config';

export default function judeAddressTextField({
  address,
  onAddressChange,
  onAddressValidityChange,
  helperText,
  ...props
}: {
  address: string;
  onAddressChange: (address: string) => void;
  onAddressValidityChange: (valid: boolean) => void;
  helperText: string;
} & TextFieldProps) {
  const placeholder = isTestnet() ? '59McWTPGc745...' : '888tNkZrPN6J...';
  const errorText = isjudeAddressValid(address, isTestnet())
    ? null
    : 'Not a valid jude address';

  useEffect(() => {
    onAddressValidityChange(!errorText);
  }, [address, onAddressValidityChange, errorText]);

  return (
    <TextField
      value={address}
      onChange={(e) => onAddressChange(e.target.value)}
      error={!!errorText && address.length > 0}
      helperText={address.length > 0 ? errorText || helperText : helperText}
      placeholder={placeholder}
      variant="outlined"
      {...props}
    />
  );
}
