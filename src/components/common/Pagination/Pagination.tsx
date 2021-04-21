import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import s from './Pagination.module.sass';

type PaginationProps = {
  size: number
  countOfElements: number
  onPageClick?: () => void
  className?: string
};

export const Pagination: React.FC<PaginationProps> = ({
  className,
  size,
  onPageClick,
  countOfElements,
}) => {
  const router = useRouter();
  const parentPath = router.asPath.split('?')[0];
  const currentPage: number = router.query.page ? +router.query.page : 1;
  const countOfPages = Math.ceil(countOfElements / size);
  if (countOfPages <= 1) return null;
  const previousPage = currentPage - 1 >= 1 ? currentPage - 1 : 0;
  const nextPage = currentPage + 1 <= countOfPages ? currentPage + 1 : 0;

  const pages = [];
  if (countOfPages <= 4) {
    for (let pageNumber = 1; pageNumber <= countOfPages; pageNumber += 1) {
      if (pageNumber === currentPage) {
        pages.push(
          <span key={`currentPage-${pageNumber}`} className={cx(s.page, s.currentPage)}>{pageNumber}</span>,
        );
      } else if (pageNumber !== 1) {
        pages.push(
          <Link
            key={`${parentPath}/${pageNumber}`}
            href={`${parentPath}?page=${pageNumber}`}
            passHref
          >
            <motion.a
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={s.page}
              onClick={onPageClick}
            >
              {pageNumber}
            </motion.a>
          </Link>,
        );
      } else {
        pages.push(
          <Link
            key={parentPath}
            href={`${parentPath}`}
            passHref
          >
            <motion.a
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={s.page}
              onClick={onPageClick}
            >
              {pageNumber}
            </motion.a>
          </Link>,
        );
      }
    }
  } else {
    if (currentPage !== 1) {
      pages.push(
        <Link
          key={parentPath}
          href={parentPath}
          passHref
        >
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={s.page}
            onClick={onPageClick}
          >
            1
          </motion.a>
        </Link>,
      );
    }
    if (currentPage > 3) {
      pages.push(
        <span key={`dots-${currentPage}-1`} className={cx(s.page, s.dots)}>.....</span>,
      );
    }
    if (currentPage >= 3) {
      pages.push(
        <Link
          key={`${parentPath}/${currentPage - 1}`}
          href={`${parentPath}?page=${currentPage - 1}`}
          passHref
        >
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={s.page}
            onClick={onPageClick}
          >
            {currentPage - 1}
          </motion.a>
        </Link>,
      );
    }
    pages.push(
      <span key={`curP-${currentPage}`} className={cx(s.page, s.currentPage)}>{currentPage}</span>,
    );
    if (countOfPages - currentPage > 1) {
      pages.push(
        <Link
          key={`${parentPath}/${currentPage + 1}`}
          href={`${parentPath}?page=${currentPage + 1}`}
          passHref
        >
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={s.page}
            onClick={onPageClick}
          >
            {currentPage + 1}
          </motion.a>
        </Link>,
      );
    }
    if (countOfPages - currentPage > 2) {
      pages.push(
        <span key={`dots-${currentPage}-2`} className={cx(s.page, s.dots)}>.....</span>,
      );
    }
    if (currentPage !== countOfPages) {
      pages.push(
        <Link
          key={`${parentPath}/${countOfPages}`}
          href={`${parentPath}?page=${countOfPages}`}
          passHref
        >
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={s.page}
            onClick={onPageClick}
          >
            {countOfPages}
          </motion.a>
        </Link>,
      );
    }
  }

  return (
    <div className={cx(s.root, className)}>
      {previousPage ? (
        <Link
          href={previousPage !== 1 ? `${parentPath}?page=${previousPage}` : parentPath}
          passHref
        >
          <motion.a
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className={s.arrow}
            onClick={onPageClick}
          >
            <img className={s.icon} src="/images/ChevronLeft.svg" alt="" />
          </motion.a>
        </Link>
      ) : (
        <span className={cx(s.arrow, s.disabled)}>
          <img className={s.icon} src="/images/ChevronLeft.svg" alt="" />
        </span>
      )}
      <div className={s.pages}>
        {pages}
      </div>
      {nextPage ? (
        <Link
          href={`${parentPath}?page=${nextPage}`}
          passHref
        >
          <motion.a
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className={s.arrow}
            onClick={onPageClick}
          >
            <img className={s.icon} src="/images/ChevronRight.svg" alt="" />
          </motion.a>
        </Link>
      ) : (
        <span className={cx(s.arrow, s.disabled)}>
          <img className={s.icon} src="/images/ChevronRight.svg" alt="" />
        </span>
      )}
    </div>
  );
};
