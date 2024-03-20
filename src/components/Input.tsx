import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from "native-base";

type InputProps = IInputProps & {
  errorMessage?: string | null;
};
export function Input({ errorMessage = null, isInvalid, ...res }: InputProps) {
  const invalid = !!errorMessage || isInvalid;
  return (
    <FormControl mb={1} isInvalid={invalid} style={{ flex: 1 }}>
      <NativeBaseInput
        bgColor={"gray.100"}
        fontSize="md"
        placeholderTextColor={"gray.500"}
        isInvalid={invalid}
        _focus={{
          bg: "gray.100",
          borderWidth: "2px",
          borderColor: "green.500",
        }}
        _invalid={{
          borderWidth: "3px",
          borderColor: "blueGray.100",
        }}
        {...res}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
