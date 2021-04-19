import React from 'react';
import cx from 'classnames';

import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { SocialButton } from '@components/ui/SocialButton';
import GithubBig from '@icons/socials/GithubBig.svg';
import TelegramBig from '@icons/socials/TelegramBig.svg';
import YoutubeBig from '@icons/socials/YoutubeBig.svg';

import s from './Footer.module.sass';

type FooterProps = {
  classNames?: string
};

export const Footer:React.FC<FooterProps> = ({
  classNames,
}) => (
  <footer className={cx(s.root, classNames)}>
    <Container>
      <Row>
        <div className={s.inner}>

          <SocialButton
            href="https://github.com/fungible-non-fungible"
            theme="orange"
            sizeT="big"
            className={s.social}
            icon={<GithubBig />}
          />
          <SocialButton
            href="https://t.me/joinchat/_yf8pBNqeOhmMWZi"
            theme="green"
            sizeT="big"
            className={s.social}
            icon={<TelegramBig />}
          />
          <SocialButton
            href="https://www.youtube.com/channel/UC4tF0v1l2cJ-hM2h2rTyRSw"
            theme="pink"
            sizeT="big"
            className={s.social}
            icon={<YoutubeBig />}
          />
        </div>
      </Row>
    </Container>
  </footer>
);
