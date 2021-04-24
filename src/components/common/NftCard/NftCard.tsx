import React from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { motion } from 'framer-motion';
import Shiitake from 'shiitake';

import { Button } from '@components/ui/Button';
import {
  Author,
  AuthorProps,
} from '@components/common/Author';
import {
  HoldersProgress,
  HolderProps,
} from '@components/common/NftCard/HoldersProgress';

import s from './NftCard.module.sass';

export type MarketplaceCardProps = {
  slug?: string
  title: string
  description: string
  image?: string
  author: AuthorProps
  holders?: HolderProps[]
  burnPercent: number
  price: number | string
  symbol?: string
  className?: string
};

export const NftCard: React.FC<MarketplaceCardProps> = ({
  slug,
  title,
  description,
  image,
  author,
  holders,
  burnPercent,
  price,
  symbol,
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    className,
  );

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={compoundClassName}
    >
      {slug && (
        <Link href={slug}>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <a className={s.link} />
        </Link>
      )}
      <div className={cx(s.imageWrapper, { [s.imageWrapperEmpty]: !image })}>
        {image && <img src={image} alt={title} />}
        <Author author={author} className={s.author} />
      </div>
      {slug ? (
        <>
          <Shiitake
            lines={1}
            throttleRate={200}
            className={s.title}
            tagName="h3"
          >
            {title}
          </Shiitake>
          <Shiitake
            lines={2}
            throttleRate={200}
            className={s.description}
            tagName="p"
          >
            {description}
          </Shiitake>
        </>
      ) : (
        <>
          <h3 className={s.title}>
            {title}
          </h3>
          <p className={s.description}>
            {description}
          </p>
        </>
      )}
      <HoldersProgress
        holders={holders}
        burnPercent={burnPercent}
        className={s.holders}
      />
      <div className={s.bottom}>
        <span className={s.price}>
          {price}
          {' '}
          {symbol || 'BNB'}
        </span>
        {slug ? (
          <Button
            className={s.button}
            sizeT="medium"
            theme="green"
            href={slug}
          >
            Purchase
          </Button>
        ) : (
          <Button
            className={s.button}
            sizeT="medium"
            theme="green"
            disabled
          >
            Purchase
          </Button>
        )}
      </div>
    </motion.div>
  );
};
