import React from 'react';
import Styles from 'modules/app/components/inner-nav/category-filters.styles.less';
import { MenuChevron, SearchIcon } from 'modules/common/icons';
import { CategoryRow } from 'modules/common/form';
import getValue from 'utils/get-value';
import { CATEGORIES_MAX, CATEGORY_PARAM_NAME } from 'modules/common/constants';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

interface CategoryInterface {
  category: string;
  icon? :React.ReactNode;
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

interface CategoryFiltersState {
  showAllCategories: boolean;
}

export default class CategoryFilters extends React.Component<
  CategoryFiltersProps,
  CategoryFiltersState
> {
  constructor(props) {
    super(props);

    this.state = {
      showAllCategories: false,
    };
  }

  render() {
    const hasSelectedCategories = this.props.selectedCategories && this.props.selectedCategories.length > 0;
    const hasSelectedCategoriesCount = this.props.selectedCategories && this.props.selectedCategories.length;

    const showAllCategoriesButton = (
      <div className={Styles.AllCategories}>
        <span>Categories</span>
        <div
          onClick={() => this.removeCategoryQuery()}
        >
          {MenuChevron} All categories
        </div>
      </div>
    );

    return (
      <div className={Styles.CategoryFilters}>
        {!hasSelectedCategories && this.renderPopularCategories()}
        {!hasSelectedCategories && this.props.categoryMetaData && this.renderAllCategories()}

        {hasSelectedCategories && this.props.categoryMetaData && showAllCategoriesButton}
        {hasSelectedCategories && this.props.categoryMetaData && hasSelectedCategoriesCount > 0 && this.renderSelectedCategories()}
      </div>
    );
  }

  renderPopularCategories() {
    let renderPopular = this.props.popularCategories.map((item, idx) => {
      if (this.props.isSearching) {
        // No meta data yet
        return (
          <div key={idx}>
            <CategoryRow
              history={this.props.history}
              category={item.category}
              handleClick={() => [item.category]}
              icon={item.icon}
              loading={true}
              count={null} />
          </div>
        );
      }

      return (
        <div key={idx}>
          <CategoryRow
            history={this.props.history}
            category={item.category}
            icon={item.icon}
            count={item.count}
            hasChildren={item.count > 0}
            handleClick={() => this.pathToChildCategory(item.category, this.props.selectedCategories)}
          />
        </div>
      );
    });

    if (this.props.popularCategories.length === 0) {
      renderPopular = (
        <span>
          {SearchIcon} No categories found
        </span>
      );
    }

    return (
      <div className={Styles.CategoriesGroup}>
        <span>Popular Categories</span>
        {renderPopular}
      </div>
    );
  }

  renderSelectedCategories() {
    return (
      <div className={Styles.SelectedCategories}>
        {this.props.selectedCategories
          .filter(categories => categories !== this.props.selectedCategory)
          .map((category, idx) => {
            return (
              <div
                key={idx}
                onClick={() => this.gotoCategory(category)}
                className={Styles.backToCategory}
              >
                {MenuChevron} {category}
              </div>
            );
          })}
        <div className={Styles.SelectedCategory}>
          <CategoryRow
            history={this.props.history}
            category={this.props.selectedCategory}
            count={this.getSelectedCategoryCount()}
            handleClick={() => [this.props.selectedCategory]}
            active={true}
            loading={this.props.isSearching}
          />
        </div>
        {this.props.selectedCategory &&
          this.getSelectedCategoryCategories().map((item, idx) => {
            return (
              <div key={idx}>
                <CategoryRow
                  history={this.props.history}
                  category={item.category}
                  count={item.count}
                  loading={this.props.isSearching}
                  handleClick={() => this.pathToChildCategory(item.category, this.props.selectedCategories)}
                  hasChildren={this.getCategoryChildrenCount([...this.props.selectedCategories, item.category]) > 0}
                />
              </div>
            );
          })}
      </div>
    );
  }

  renderAllCategories() {
    const hasOtherCats = this.props.allOtherCategories && this.props.allOtherCategories.length > 0;

    if (!hasOtherCats) return null;

    const numToShow = this.props.allOtherCategories.length - CATEGORIES_MAX;

    const hasMoreThanMax =
      hasOtherCats && this.props.allOtherCategories.length >= CATEGORIES_MAX;

    const createCategoryRow = (item, idx) => {
      return (
        <div key={idx}>
          <CategoryRow
            history={this.props.history}
            category={item.category}
            count={item.count}
            loading={this.props.isSearching}
            hasChildren={item.count > 0}
            handleClick={() => this.pathToChildCategory(item.category, this.props.selectedCategories)}
          />
        </div>
      );
    };

    const renderAFew = hasOtherCats
      ? this.props.allOtherCategories.slice(0, CATEGORIES_MAX).map(createCategoryRow)
      : null;
    const renderAllOther = hasOtherCats
      ? this.props.allOtherCategories.map(createCategoryRow)
      : null;

    return (
      <div className={Styles.CategoriesGroup}>
        <span>All Categories</span>
        {hasMoreThanMax && !this.state.showAllCategories && renderAFew}
        {(!hasMoreThanMax || this.state.showAllCategories) && renderAllOther}
        {hasMoreThanMax && !this.state.showAllCategories && (
          <div
            className={Styles.ShowAll}
            onClick={() => this.toggleShowAllCategories()}
          >
            + Show More ({numToShow})
          </div>
        )}
      </div>
    );
  }


  removeCategoryQuery = () => {
    const { history, location } = this.props;

    let updatedSearch = parseQuery(location.search);
    delete updatedSearch[CATEGORY_PARAM_NAME];
    updatedSearch = makeQuery(updatedSearch);

    history.push({
      ...location,
      search: updatedSearch,
    });
  }


  gotoCategory(selectedCategory) {
    const indexOfSelected = this.props.selectedCategories.indexOf(selectedCategory);
    const selectedCategories = this.props.selectedCategories.slice(0, indexOfSelected + 1);

    const query: QueryEndpoints = {
      [CATEGORY_PARAM_NAME]: selectedCategories,
    };

    this.props.history.push({
      pathname: 'markets',
      search: makeQuery(query),
    });
  }

  getSelectedCategoryCategories() {
    const { categoryMetaData, selectedCategories } = this.props;
    const { categories } = categoryMetaData;
    const childrenCategories = selectedCategories.reduce((p, cat) => p[cat] ? p[cat].children : p, categories);

    return Object.keys(childrenCategories)
      .filter(this.removeBlankCategories)
      .map(category => {
        return {
          category,
          count: childrenCategories[category].count,
          children: childrenCategories[category].children,
        };
      });
  }

  getCategoryChildrenCount(categories) {
    const { categoryMetaData } = this.props;
    if (!categoryMetaData || !categories || categories.length === 0) return [];
    const { categories: metaCategories } = categoryMetaData;
    const childrenCategories = categories.reduce((p, cat, index) => p[cat] ? index === categories.length - 1 ? p[cat] : p[cat].children : p, metaCategories);
    return childrenCategories ? childrenCategories.count : 0;
  }

  getSelectedCategoryCount() {
    const { selectedCategories } = this.props;
    // selected category is the last category in selectedCategories
    return this.getCategoryChildrenCount(selectedCategories);
  }

  pathToChildCategory(selectedCategory, selectedCategories, hidden = true) {
    if (this.props.isSearching && hidden) return [];
    return selectedCategories.concat(selectedCategory);
  }

  removeBlankCategories(category) {
     return Boolean(category);
  }

  toggleShowAllCategories() {
    this.setState({
      showAllCategories: !this.state.showAllCategories,
    });
  }
}
