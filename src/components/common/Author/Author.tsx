import React from 'react';
import cx from 'classnames';

import { shortize } from '@utils/helpers';

import s from './Author.module.sass';

export type AuthorProps = {
  image?: string
  accountPkh: string
};

type AuthorCardProps = {
  author: AuthorProps
  className?: string
};

export const Author: React.FC<AuthorCardProps> = ({
  author,
  className,
}) => (
  <div className={cx(s.root, className)}>
    <div className={cx(s.image, { [s.imageEmpty]: !author.image })}>
      {author.image && <img src={author.image} alt={author.accountPkh} />}
    </div>
    <h5 className={s.accountPkh}>
      {shortize(author.accountPkh)}
    </h5>
  </div>
);
