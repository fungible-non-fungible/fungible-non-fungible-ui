import React from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';

import {
  Button,
  themeClass as buttonThemeClass,
} from '@components/ui/Button';
import {
  Heading,
  themeClass as headingThemeClass,
} from '@components/ui/Heading';
import { NftCard } from '@components/common/NftCard';

import s from './Marketplace.module.sass';
import { nftsArray } from '../../content/nfts';

type MarketplaceProps = {
  title?: string
  headingTheme?: keyof typeof headingThemeClass
  buttonText?: string
  buttonTheme?: keyof typeof buttonThemeClass
  isPaginated?: boolean
  className?: string
};

export const MarketplaceContainer: React.FC<MarketplaceProps> = ({
  title,
  headingTheme,
  buttonText,
  buttonTheme,
  isPaginated = false,
  className,
}) => {
  const router = useRouter();
  const parentPath = router.asPath.split('?')[0];
  const currentPage: number = router.query.page ? +router.query.page : 1;
  if (currentPage < 1) {
    router.replace(parentPath);
  }

  return (
    <section className={cx(s.root, className)}>
      {title && (
        <Heading
          title={title}
          items={4}
          theme={headingTheme}
        />
      )}
      <div className={s.cards}>
        {nftsArray.map((nft) => (
          <NftCard
            key={nft.slug}
            slug={nft.slug}
            title={nft.title}
            description={nft.description}
            image={nft.image}
            author={nft.author}
            holders={nft.holders}
            burnPercent={nft.burnPercent}
            price={nft.price}
          />
        ))}
      </div>
      {isPaginated
        ? (
          <span>
            {/* TODO: Pagination */}
          </span>
        )
        : (
          <Button
            href="/marketplace"
            theme={buttonTheme}
            className={s.button}
          >
            {buttonText}
          </Button>
        )}
    </section>
  );
};
