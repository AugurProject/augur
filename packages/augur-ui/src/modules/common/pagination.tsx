import React from 'react';
import classNames from 'classnames';
import { DirectionButton } from 'modules/common/buttons';
import { SquareDropdown } from 'modules/common/selection';
import { PAGINATION_VIEW_OPTIONS } from 'modules/common/constants';
import Styles from 'modules/common/pagination.styles.less';

interface PaginationProps {
  page: number;
  itemsPerPage: number;
  itemCount: number;
  action: Function;
  updateLimit: Function;
  showLimitChanger?: boolean;
  maxLimit?: number;
  showPagination?: boolean;
}
interface PagesArrayObject {
  page: number | null;
  active: boolean;
}

const NullPage = { page: null, active: false };

export const createPagesArray = (page: number, totalPages: number) => {
  if (totalPages <= 1) {
    return [
      {
        page: 1,
        active: true,
      },
    ];
  }
  let ArrayToShow: Array<PagesArrayObject> = [];
  const PagesArray: Array<PagesArrayObject> = [];
  const SevenBefore: Array<PagesArrayObject> = [];
  const SevenAfter: Array<PagesArrayObject> = [];
  const maxLength = 7; // actual max is 9, 7 to figure out + first/last
  for (let i = 1; i <= totalPages; i++) {
    PagesArray.push({
      page: i,
      active: page === i,
    });
  }
  for (let b = -8; b < -1; b++) {
    if (PagesArray[page + b] && PagesArray[page + b].page !== 1) {
      SevenBefore.push(PagesArray[page + b]);
    }
  }
  for (let a = 0; a <= 6; a++) {
    if (PagesArray[page + a] && PagesArray[page + a].page !== totalPages) {
      SevenAfter.push(PagesArray[page + a]);
    }
  }
  const beforeLen = SevenBefore.length;
  const afterLen = SevenAfter.length;
  const addPage = page !== 1 && page !== totalPages;
  ArrayToShow.push(PagesArray[0]);
  const beforeSlice = maxLength - afterLen - (addPage ? 1 : 0);
  const newBefore =
    beforeSlice > 2 ? SevenBefore.splice(-beforeSlice) : SevenBefore.splice(-3);
  ArrayToShow = ArrayToShow.concat(newBefore);
  if (addPage) ArrayToShow.push(PagesArray[page - 1]);
  const afterSlice = maxLength - beforeLen - (addPage ? 1 : 0);
  const newAfter =
    afterSlice > 2 ? SevenAfter.splice(0, afterSlice) : SevenAfter.splice(0, 3);
  ArrayToShow = ArrayToShow.concat(newAfter);
  ArrayToShow.push(PagesArray[totalPages - 1]);
  const finalLen = ArrayToShow.length;
  // add Nulls as needed:
  if (ArrayToShow[1].page !== 2) ArrayToShow[1] = NullPage;
  if (ArrayToShow[finalLen - 2].page !== totalPages - 1) {
    ArrayToShow[finalLen - 2] = NullPage;
  }
  return ArrayToShow;
};

const renderPageButtons = (
  pagesArray: PagesArrayObject[],
  action: Function
) => (
  <>
    {pagesArray.map((page: PagesArrayObject, index) => (
      <button
        key={`${page.page}${index}`}
        className={classNames({ [Styles.Active]: page.active })}
        onClick={() => action(page.page)}
        disabled={page.page === null}
      >
        {page.page ? page.page : String.fromCodePoint(0x2026)}
      </button>
    ))}
  </>
);

const getLimitOptions = (itemCount: number, maxLimit: number) => {
  let paginationOptions = [
    { value: maxLimit, label: PAGINATION_VIEW_OPTIONS.ALL },
    { value: 10, label: PAGINATION_VIEW_OPTIONS.TEN },
  ];

  if (itemCount >= 50) {
    paginationOptions = paginationOptions.concat({
      value: 50,
      label: PAGINATION_VIEW_OPTIONS.FIFTY,
    });
  }

  if (itemCount >= 100) {
    paginationOptions = paginationOptions.concat({
      value: 100,
      label: PAGINATION_VIEW_OPTIONS.HUNDRED,
    });
  }

  return paginationOptions;
};

export const Pagination = ({
  page,
  action,
  itemCount,
  itemsPerPage,
  updateLimit,
  showLimitChanger,
  maxLimit,
  showPagination = true,
}: PaginationProps) => {
  const totalPages =
    itemsPerPage === 1 ? 1 : Math.ceil(itemCount / (itemsPerPage || 10)) || 1;

  return (
    <div className={Styles.Pagination}>
      {showPagination && (
        <section>
          <DirectionButton
            action={() => action(page - 1)}
            left
            disabled={page === 1}
          />
          {renderPageButtons(createPagesArray(page, totalPages), action)}
          <span>
            {page} of {totalPages}
          </span>
          <DirectionButton
            action={() => action(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          />
        </section>
      )}

      {showLimitChanger && (
        <SquareDropdown
          defaultValue={itemsPerPage}
          options={getLimitOptions(itemCount, maxLimit)}
          onChange={updateLimit}
        />
      )}
    </div>
  );
};
