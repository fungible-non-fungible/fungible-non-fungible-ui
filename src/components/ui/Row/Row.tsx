import React from 'react';
import cx from 'classnames';

import s from './Row.module.sass';

type RowProps = {
  className?: string
};

export const Row: React.FC<RowProps> = ({ children, className }) => (
  <div className={cx(s.root, className)}>{children}</div>
);
