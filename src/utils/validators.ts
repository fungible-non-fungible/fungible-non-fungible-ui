type ValidationType = (value: string) => string | undefined;

export const required = (value: string) => (
  value
    ? undefined
    : 'This field is required'
);

export const composeValidators = (...validators: ValidationType[]) => (value: string) => (
  validators.reduce(
    (
      error: string | undefined,
      validator: ValidationType,
    ) => error || validator(value), undefined,
  )
);
