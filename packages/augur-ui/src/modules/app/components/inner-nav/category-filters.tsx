import React, { useState } from 'react';
import Styles from 'modules/app/components/inner-nav/category-filters.styles.less';
import { MenuChevron, SearchIcon } from 'modules/common/icons';
import { CategoryRow } from 'modules/common/form';
import getValue from 'utils/get-value';
import { CATEGORIES_MAX, CATEGORY_PARAM_NAME } from 'modules/common/constants';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';
import { QueryEndpoints } from 'modules/types';

interface CategoryInterface {
  category: string;
  icon?: React.ReactNode;
  count: number;
  children: object;
}

interface CategoryMetaDataInterface {
  marketCount: number;
  filteredOutCount: number;
  categories: CategoryInterface[];
}

interface CategoryFiltersProps {
  isSearching: boolean;
  categoryMetaData: CategoryMetaDataInterface;
  popularCategories: CategoryInterface[];
  allOtherCategories: CategoryInterface[];
  selectedCategories: string[];
  selectedCategory: string;
  history: History;
  location: Location;
}

const CategoryFilters = ({
  isSearching,
  categoryMetaData,
  popularCategories,
  allOtherCategories,
  selectedCategories,
  selectedCategory,
  history,
  location,
}: CategoryFiltersProps) => {
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
      pathname: 'markets',
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

  const pathToChildCategory = (
    selectedCategory,
    selectedCategories,
    hidden = true
  ) => {
    if (isSearching && hidden) return [];
    return selectedCategories.concat(selectedCategory);
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
            history={history}
            category={item.category}
            count={item.count}
            loading={isSearching}
            hasChildren={item.count > 0}
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

  const renderPopularCategories = () => {
    let renderPopular = popularCategories.map((item, idx) => {
      if (isSearching) {
        // No meta data yet
        return (
          <div key={idx}>
            <CategoryRow
              history={history}
              category={item.category}
              handleClick={() => [item.category]}
              icon={item.icon}
              loading={true}
              count={null}
            />
          </div>
        );
      }

      return (
        <div key={idx}>
          <CategoryRow
            history={history}
            category={item.category}
            icon={item.icon}
            count={item.count}
            hasChildren={item.count > 0}
            handleClick={() =>
              pathToChildCategory(item.category, selectedCategories)
            }
          />
        </div>
      );
    });

    if (popularCategories.length === 0) {
      renderPopular = <span>{SearchIcon} No categories found</span>;
    }

    return (
      <div className={Styles.CategoriesGroup}>
        <span>Popular Categories</span>
        {renderPopular}
      </div>
    );
  };

  const renderSelectedCategories = () => {
    return (
      <div className={Styles.SelectedCategories}>
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
            history={history}
            category={selectedCategory}
            count={getSelectedCategoryCount()}
            handleClick={() => [selectedCategory]}
            active={true}
            loading={isSearching}
          />
        </div>
        {selectedCategory &&
          getSelectedCategoryCategories().map((item, idx) => {
            return (
              <div key={idx}>
                <CategoryRow
                  history={history}
                  category={item.category}
                  count={item.count}
                  loading={isSearching}
                  handleClick={() =>
                    pathToChildCategory(item.category, selectedCategories)
                  }
                  hasChildren={
                    getCategoryChildrenCount([
                      ...selectedCategories,
                      item.category,
                    ]) > 0
                  }
                />
              </div>
            );
          })}
      </div>
    );
  };

  const hasSelectedCategories =
    selectedCategories && selectedCategories.length > 0;
  const hasSelectedCategoriesCount =
    selectedCategories && selectedCategories.length;

  const showAllCategoriesButton = (
    <div className={Styles.AllCategories}>
      <span>Categories</span>
      <div onClick={() => removeCategoryQuery()}>
        {MenuChevron} All categories
      </div>
    </div>
  );

  return (
    <div className={Styles.CategoryFilters}>
      {!hasSelectedCategories && renderPopularCategories()}
      {!hasSelectedCategories && categoryMetaData && renderAllCategories()}

      {hasSelectedCategories && categoryMetaData && showAllCategoriesButton}
      {hasSelectedCategories &&
        categoryMetaData &&
        hasSelectedCategoriesCount > 0 &&
        renderSelectedCategories()}
    </div>
  );
};

export default CategoryFilters;
