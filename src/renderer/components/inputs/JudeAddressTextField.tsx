import React, { useEffect } from 'react';
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

  function getAddressError() {
    if (isjudeAddressValid(address, isTestnet())) {
      return null;
    }
    return 'Not a valid jude address';
  }

  const errorText = getAddressError();

  useEffect(() => {
    onAddressValidityChange(!errorText);
  }, [address, getAddressError, onAddressValidityChange]);

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
