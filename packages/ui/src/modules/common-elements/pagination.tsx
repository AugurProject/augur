import React from "react";
import classNames from "classnames";
import { DirectionButton } from "modules/common-elements/buttons";

import Styles from "modules/common-elements/pagination.styles";

interface PaginationProps {
  page: number;
  itemsPerPage: number;
  itemCount: number;
  action: Function;
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
        active: true
      }
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
      active: page === i
    });
  }
  for (let b = -8; b < -1; b++) {
    if (PagesArray[page + b] && PagesArray[page + b].page !== 1)
      SevenBefore.push(PagesArray[page + b]);
  }
  for (let a = 0; a <= 6; a++) {
    if (PagesArray[page + a] && PagesArray[page + a].page !== totalPages)
      SevenAfter.push(PagesArray[page + a]);
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
  if (ArrayToShow[finalLen - 2].page !== totalPages - 1)
    ArrayToShow[finalLen - 2] = NullPage;
  return ArrayToShow;
};

const renderPageButtons = (
  pagesArray: Array<PagesArrayObject>,
  action: Function
) => (
  <>
    {pagesArray.map((page: PagesArrayObject) => (
      <button
        key={`${page.page}`}
        className={classNames({ [Styles.Active]: page.active })}
        onClick={() => action(page.page)}
        disabled={page.page === null}
      >
        {page.page ? page.page : String.fromCodePoint(0x2026)}
      </button>
    ))}
  </>
);

export const Pagination = (props: PaginationProps) => {
  const { page, action, itemCount, itemsPerPage } = props;
  const totalPages = Math.ceil(itemCount / itemsPerPage);
  return (
    <div className={Styles.Pagination}>
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
    </div>
  );
};
