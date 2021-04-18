import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import cx from 'classnames';
import {
  motion,
  useMotionValue,
} from 'framer-motion';

import {
  convertFromNumberToPercent,
  convertFromPercentToNumber,
} from '@utils/helpers';

import s from './Slider.module.sass';

type SwitcherProps = {
  inputValue: number
  minValue: number
  maxValue: number
  onDragEnd: (value: number) => void
  className?: string
};

export const Slider: React.FC<SwitcherProps> = ({
  inputValue,
  minValue,
  maxValue,
  onDragEnd,
  className,
}) => {
  const sliderXVal = useMotionValue(0);
  const [xVal, setXVal] = useState(0);
  const [width, setWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sliderRef.current) {
      setWidth(sliderRef.current.offsetWidth);
      setXVal((inputValue * sliderRef.current.offsetWidth) / 100);
    }
  }, []);

  const convertToPixels = (value: number) => convertFromPercentToNumber(value, width);
  const convertToPercents = (value: number) => convertFromNumberToPercent(value, width);

  useEffect(() => {
    let finalX = inputValue;
    if (inputValue < minValue) {
      finalX = minValue;
    } else if (inputValue > maxValue) {
      finalX = maxValue;
    }
    sliderXVal.set(convertToPixels(finalX));
  }, [inputValue, width]);

  useEffect(
    () => sliderXVal.onChange(() => {
      const getValue = sliderXVal.get();
      let finalX = getValue;
      if (getValue < convertToPixels(minValue)) {
        finalX = convertToPixels(minValue);
      } else if (getValue > convertToPixels(maxValue)) {
        finalX = convertToPixels(maxValue);
      }
      setXVal(finalX);
    }),
    [sliderXVal, width],
  );

  const getColors = (value: number) => {
    if (convertToPercents(value) <= 10) {
      return {
        first: '#56A3E6',
        second: '#80CDDF',
      };
    }
    if (convertToPercents(value) <= 20) {
      return {
        first: '#65C9C9',
        second: '#63C58F',
      };
    }
    if (convertToPercents(value) <= 40) {
      return {
        first: '#EBCD72',
        second: '#EA9055',
      };
    }
    return {
      first: '#F28EDD',
      second: '#BE33A8',
    };
  };

  const pointerVariant = {
    hover: { scale: 1.2 },
  };
  const pointerPercentVariant = {
    hover: {
      x: '-50%',
      y: 0,
      scale: 1,
      opacity: 1,
    },
  };

  return (
    <div
      className={cx(s.root, className)}
      style={{
        background: `linear-gradient(
          to right, 
          ${getColors(xVal).first} 0%, 
          ${getColors(xVal).second} ${convertToPercents(xVal)}%, 
          #3c4669 ${convertToPercents(xVal) + 2.5}%
        )`,
      }}
      ref={sliderRef}
    >
      <motion.div
        className={s.pointer}
        style={{ x: sliderXVal }}
        whileHover="hover"
        variants={pointerVariant}
        drag="x"
        dragConstraints={{
          left: convertToPixels(minValue),
          right: convertToPixels(maxValue),
        }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={() => {
          onDragEnd(convertToPercents(xVal));
        }}
      >
        <motion.span
          className={s.percent}
          initial={{
            x: '-50%',
            opacity: 0,
            y: '-75%',
            scale: 0.7,
          }}
          variants={pointerPercentVariant}
        >
          {convertToPercents(xVal).toFixed(2)}
          %
        </motion.span>
      </motion.div>
    </div>
  );
};
