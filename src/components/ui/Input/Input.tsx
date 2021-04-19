import React, { useState } from 'react';
import cx from 'classnames';

import s from './Input.module.sass';

export type InputProps = {
  label?: string
  type?: string
  error?: string
  textarea?: boolean
  success?: boolean
  labelClassName?: string
  inputClassName?: string
  theme?: keyof typeof themeClass
  sizeT?: keyof typeof sizeClass
  currency?: string
} & React.InputHTMLAttributes<HTMLInputElement>;

const themeClass = {
  blue: s.blue,
  green: s.green,
  orange: s.orange,
};

const sizeClass = {
  default: s.default,
  small: s.small,
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  error,
  inputClassName,
  className,
  value,
  textarea = false,
  success = false,
  labelClassName,
  currency,
  theme = 'blue',
  sizeT = 'default',
  disabled,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const compoundClassName = cx(
    s.inputWrapper,
    { [s.focused]: focused },
    { [s.hovered]: hovered },
    { [s.errorInput]: !!error },
    { [s.success]: success },
    { [s.disabled]: disabled },
    sizeClass[sizeT],
  );

  if (textarea) {
    return (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      <label className={cx(
        s.root,
        className,
        { [s.error]: error },
        { [s.disabledLabel]: disabled },
      )}
      >
        {label && (
        <span className={s.label}>{label}</span>
        )}
        <div className={compoundClassName}>
          <textarea
            {...props}
            // @ts-ignore
            ref={ref}
            value={value}
            disabled={disabled}
            className={cx(s.input, s.textarea)}
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>
        <div className={s.errorContainer}>
          {error && (
          <div className={cx(s.errorText)}>{error}</div>
          )}
        </div>
      </label>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={cx(
      s.root,
      className,
      { [s.error]: error },
      { [s.disabledLabel]: disabled },
    )}
    >
      {label && (
        <span className={cx(s.label, labelClassName)}>{label}</span>
      )}
      <div className={compoundClassName}>
        <input
          {...props}
          ref={ref}
          type={type}
          value={value}
          disabled={disabled}
          className={cx(s.input, inputClassName)}
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {currency && (
          <p className={cx(s.currency, themeClass[theme])}>
            {currency}
          </p>
        )}
      </div>

      <div className={s.errorContainer}>
        {error && (
          <div className={cx(s.errorText)}>{error}</div>
        )}
      </div>
    </label>
  );
});
