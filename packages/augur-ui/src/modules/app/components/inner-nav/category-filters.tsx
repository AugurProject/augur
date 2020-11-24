import React, { useState } from 'react';
import Styles from 'modules/app/components/inner-nav/category-filters.styles.less';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router';
import { MenuChevron, SearchIcon } from 'modules/common/icons';
import { CategoryRow } from 'modules/common/form';
import {
  CATEGORIES_MAX,
  CATEGORY_PARAM_NAME,
  THEMES,
  SPORTSBOOK_CATEGORIES,
} from 'modules/common/constants';
import { MARKETS } from 'modules/routes/constants/views';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';
import { QueryEndpoints } from 'modules/types';
import { useAppStatusStore, AppStatus } from 'modules/app/store/app-status';
import {
  selectPopularCategories,
  selectAllOtherCategories,
} from 'modules/markets-list/selectors/markets-list';

const { POLITICS, SPORTS } = SPORTSBOOK_CATEGORIES;

export const pathToChildCategory = (
  selectedCategory,
  selectedCategories,
  hidden = true
) => {
  const {
    marketsList: { isSearching }
  } = AppStatus.get();
  if (isSearching && hidden) return [];
  return selectedCategories.concat(selectedCategory);
};

const CategoryFilters = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    theme,
    isMobile,
    marketsList: {
      meta,
      isSearching,
      selectedCategories,
      selectedCategory,
      allCategoriesMeta,
    },
  } = useAppStatusStore();

  const isSportsTheme = theme === THEMES.SPORTS;
  const sportsMobileView = isSportsTheme && isMobile;
  const categoryMetaData = sportsMobileView ? allCategoriesMeta : meta;
  const popularCategories = selectPopularCategories(isSportsTheme);
  const allOtherCategories = selectAllOtherCategories();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const removeCategoryQuery = () => {
    let updatedSearch = parseQuery(location.search);
    delete updatedSearch[CATEGORY_PARAM_NAME];
    updatedSearch = makeQuery(updatedSearch);

    history.push({
      ...location,
      search: updatedSearch,
    });
  };

  const getSelectedCategoryCategories = () => {
    const { categories } = categoryMetaData;
    const childrenCategories = selectedCategories.reduce(
      (p, cat) => (p[cat] ? p[cat].children : p),
      categories
    );

    return childrenCategories
      ? Object.keys(childrenCategories)
          .filter(removeBlankCategories)
          .map(category => {
            return {
              category,
              count: childrenCategories[category].count,
              children: childrenCategories[category].children,
            };
          })
      : [];
  };

  const gotoCategory = (category, categories) => {
    const indexOfSelected = categories.indexOf(category);
    const selectedCategories = categories.slice(0, indexOfSelected + 1);

    const query: QueryEndpoints = {
      [CATEGORY_PARAM_NAME]: selectedCategories,
    };

    history.push({
      pathname: MARKETS,
      search: makeQuery(query),
    });
  };

  const getCategoryChildrenCount = categories => {
    if (!categoryMetaData || !categories || categories.length === 0) return [];
    const { categories: metaCategories } = categoryMetaData;
    const childrenCategories = categories.reduce(
      (p, cat, index) =>
        p[cat]
          ? index === categories.length - 1
            ? p[cat]
            : p[cat].children
          : p,
      metaCategories
    );
    return childrenCategories && childrenCategories.count
      ? childrenCategories.count
      : 0;
  };

  const getSelectedCategoryCount = () => {
    // selected category is the last category in selectedCategories
    return getCategoryChildrenCount(selectedCategories);
  };

  const removeBlankCategories = category => {
    return Boolean(category);
  };

  const renderAllCategories = () => {
    const hasOtherCats = allOtherCategories && allOtherCategories.length > 0;
    if (!hasOtherCats) return null;
    const numToShow = allOtherCategories.length - CATEGORIES_MAX;
    const hasMoreThanMax =
      hasOtherCats && allOtherCategories.length >= CATEGORIES_MAX;
    const createCategoryRow = (item, idx) => {
      return (
        <div key={idx}>
          <CategoryRow
            category={item.category}
            count={item.count}
            handleClick={() =>
              pathToChildCategory(item.category, selectedCategories)
            }
          />
        </div>
      );
    };

    const renderAFew = hasOtherCats
      ? allOtherCategories.slice(0, CATEGORIES_MAX).map(createCategoryRow)
      : null;
    const renderAllOther = hasOtherCats
      ? allOtherCategories.map(createCategoryRow)
      : null;

    return (
      <div className={Styles.CategoriesGroup}>
        <span>All Categories</span>
        {hasMoreThanMax && !showAllCategories && renderAFew}
        {(!hasMoreThanMax || showAllCategories) && renderAllOther}
        {hasMoreThanMax && !showAllCategories && (
          <div
            className={Styles.ShowAll}
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            + Show More ({numToShow})
          </div>
        )}
      </div>
    );
  };

  const getSubRows = ({ children }) => {
    const subRows = [];
    for (const [key, value] of Object.entries(children)) {
      subRows.push({ category: key, ...value });
    }
    return subRows.sort((a, b) => b.count - a.count);
  };

  const renderPopularCategories = () => {
    const categoriesToRender = isSportsTheme
      ? popularCategories.filter(
          ({ category }) => category === SPORTS || category === POLITICS
        )
      : popularCategories;
    let renderPopular = categoriesToRender.map((item, idx) => {
      if (isSearching) {
        // No meta data yet
        return (
          <div key={idx}>
            <CategoryRow
              category={item.category}
              handleClick={() => [item.category]}
              icon={item.icon}
            />
          </div>
        );
      }
      let subRows = [];
      if (isSportsTheme && item.children) {
        subRows = getSubRows(item);
      }

      return (
        <div key={idx}>
          <CategoryRow
            category={item.category}
            icon={item.icon}
            count={item.count}
            handleClick={() =>
              pathToChildCategory(item.category, isSportsTheme ? [] : selectedCategories)
            }
          />
          {isSportsTheme && subRows.length > 0 && (
            <section>
              {subRows.map((subItem, index) => (
                <div key={`${item.category}-${index}`}>
                  <CategoryRow
                    parentCategory={item.category}
                    category={subItem.category}
                    count={subItem.count}
                    children={subItem.children}
                    showChildren={sportsMobileView}
                    handleClick={() =>
                      pathToChildCategory(subItem.category, [item.category])
                    }
                  />
                </div>
              ))}
            </section>
          )}
        </div>
      );
    });

    if (popularCategories.length === 0) {
      renderPopular = <span>{SearchIcon} No categories found</span>;
    }
    const header = isSportsTheme ? 'Explore Categories' : 'Popular Categories';
    return (
      <div className={Styles.CategoriesGroup}>
        <span>{header}</span>
        {renderPopular}
      </div>
    );
  };

  const renderSelectedCategories = () => (
    <div
      className={classNames(Styles.SelectedCategories, {
        [Styles.SubCategories]: selectedCategories.length > 1,
      })}
    >
      {selectedCategories
        .filter(categories => categories !== selectedCategory)
        .map((category, idx) => {
          return (
            <div
              key={idx}
              onClick={() => gotoCategory(category, selectedCategories)}
              className={Styles.backToCategory}
            >
              {MenuChevron} {category}
            </div>
          );
        })}
      <div className={Styles.SelectedCategory}>
        <CategoryRow
          category={selectedCategory}
          count={getSelectedCategoryCount()}
          handleClick={() => [selectedCategory]}
        />
      </div>
      {selectedCategory &&
        getSelectedCategoryCategories().map((item, idx) => {
          return (
            <div key={idx}>
              <CategoryRow
                category={item.category}
                count={item.count}
                handleClick={() =>
                  pathToChildCategory(item.category, selectedCategories)
                }
              />
            </div>
          );
        })}
    </div>
  );

  const hasSelectedCategoriesCount = selectedCategories?.length;
  const hasSelectedCategories = hasSelectedCategoriesCount > 0 || false;

  const showAllCategoriesButton = (
    <div className={Styles.AllCategories}>
      <span>Categories</span>
      <div onClick={() => removeCategoryQuery()}>
        {MenuChevron} All categories
      </div>
    </div>
  );
  const sportsTitle = selectedCategory && !sportsMobileView ? selectedCategory : 'Popular Markets';
  return (
    <div className={Styles.CategoryFilters}>
      {isSportsTheme &&
        (isMobile ? (
          <h3>
            <CategoryRow
              category={sportsTitle}
              allCategories
              count={categoryMetaData?.marketCount}
              handleClick={() => removeCategoryQuery()}
            />
          </h3>
        ) : (
          <h3>{sportsTitle}</h3>
        ))}
      {(!hasSelectedCategories || sportsMobileView) && renderPopularCategories()}
      {(!hasSelectedCategories && categoryMetaData || sportsMobileView) && renderAllCategories()}

      {hasSelectedCategories && categoryMetaData && !sportsMobileView && showAllCategoriesButton}
      {hasSelectedCategories &&
        categoryMetaData &&
        hasSelectedCategoriesCount > 0 && !sportsMobileView && 
        renderSelectedCategories()}
    </div>
  );
};

export default CategoryFilters;
