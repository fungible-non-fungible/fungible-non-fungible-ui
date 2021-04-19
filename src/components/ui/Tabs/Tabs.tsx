import React from 'react';
import cx from 'classnames';
import { AnimateSharedLayout } from 'framer-motion';

import { Tab } from '@components/ui/Tabs/Tab';

import s from './Tabs.module.sass';

type TabsProps = {
  theme?: keyof typeof themeClass
  tabs: string[]
  selectedTab: string
  onChangeTab: (tab: string) => void
  className?: string
};

const themeClass = {
  purple: s.purple,
  pink: s.pink,
  green: s.green,
  blue: s.blue,
};

export const Tabs: React.FC<TabsProps> = ({
  theme = 'purple',
  tabs,
  selectedTab,
  onChangeTab,
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    themeClass[theme],
    className,
  );

  return (
    <AnimateSharedLayout>
      <div className={cx(compoundClassName)}>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            theme={theme}
            isSelected={selectedTab === tab}
            onClick={() => onChangeTab(tab)}
          >
            {tab}
          </Tab>
        ))}
      </div>
    </AnimateSharedLayout>
  );
};
