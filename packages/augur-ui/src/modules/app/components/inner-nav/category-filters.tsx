import React from 'react';
import Styles from 'modules/app/components/inner-nav/category-filters.styles.less';
import { MenuChevron } from 'modules/common/icons';
import { CategoryRow } from 'modules/common/form';
import getValue from 'utils/get-value';
import { CATEGORIES_MAX } from 'modules/common/constants';

interface CategoryInterface {
  category: string;
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
}

interface CategoryFiltersState {
  showAllCategories: boolean;
  selectedCategories: CategoryInterface[];
  selectedCategory: CategoryInterface;
  currentCategories: object;
}

export default class CategoryFilters extends React.Component<
  CategoryFiltersProps,
  CategoryFiltersState
> {
  constructor(props) {
    super(props);

    this.state = {
      showAllCategories: false,
      selectedCategories: [],
      selectedCategory: null,
      currentCategories: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSearching) {
      this.setState({
        showAllCategories: false,
        currentCategories: null,
        selectedCategory: null,
        selectedCategories: [],
      });
    }
  }

  render() {
    const hasSelectedCategories = this.state.selectedCategories && this.state.selectedCategories.length > 0;
    const hasSelectedCategoriesCount = this.state.selectedCategories && this.state.selectedCategories.length;

    const showAllCategoriesButton = (
      <div
        className={Styles.AllCategories}
        onClick={() => this.gotoAllCategories()}
      >
        {MenuChevron} All categories
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
    const renderPopular = this.props.popularCategories.map((item, idx) => {
      if (this.props.isSearching) {
        // No meta data yet
        return (
          <div key={idx}>
            <CategoryRow
              category={item.category}
              loading={true} />;
          </div>
        );
      }

      return (
        <div key={idx}>
          <CategoryRow
            category={item.category}
            count={item.count}
            hasChildren={item.count > 0}
            handleClick={() => this.getChildrenCategories(item.category)}
          />
        </div>
      );
    });

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
        {this.state.selectedCategories
          .filter(categories => categories !== this.state.selectedCategory)
          .map((category, idx) => {
            return (
              <div
                key={idx}
                onClick={() => this.gotoCategory(category)}
              >
                {MenuChevron} {category}
              </div>
            );
          })}
        <div className={Styles.SelectedCategory}>
          <CategoryRow
            category={this.state.selectedCategory}
            count={this.getCategoryCount(this.state.selectedCategory)}
            handleClick={() => null}
            active={true}
          />
        </div>
        {this.state.selectedCategory &&
          this.getSelectedCategories().map((item, idx) => {
            return (
              <div key={idx}>
                <CategoryRow
                  category={item.category}
                  count={item.count}
                  handleClick={() => this.getChildrenCategories(item.category)}
                  hasChildren={this.hasChildren(item.category)}
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
            category={item.category}
            count={item.count}
            hasChildren={item.count > 0}
            handleClick={() => this.getChildrenCategories(item.category)}
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

  gotoAllCategories() {
    this.setState({
      selectedCategories: [],
      selectedCategory: null,
      currentCategories: this.props.categoryMetaData.categories,
    });
  }

  gotoCategory(selectedCategory) {
    const indexOfSelected = this.state.selectedCategories.indexOf(selectedCategory);
    const selectedCategories = this.state.selectedCategories.slice(0, indexOfSelected + 1);

    const newCategory = this.lookupCategoryFromMeta(selectedCategory);
    this.setState({
      selectedCategories,
      selectedCategory,
      currentCategories: newCategory.children,
    });
  }

  lookupCategoryFromMeta(selectedCategory) {
    const indexOfSelected = this.state.selectedCategories.indexOf(selectedCategory);

    let pathString = '';
    // Used to walk the categories meta data object
    // -> category: {
    //   -> children: {
    //     -> category
    //       -> ...
    for (let i = 0; i <= indexOfSelected; i++) {
      const cat = this.state.selectedCategories[i];
      pathString = pathString + `${ i > 0 ? '.children.' : ''}${cat}`;
    }

    return getValue(this.props.categoryMetaData.categories, pathString);
  }

  hasChildren(selectedCategory) {
    const metaCategories = this.state.currentCategories;
    const childrenCategories = metaCategories[selectedCategory] && metaCategories[selectedCategory].children;

    if (childrenCategories) {
      const metaCategoriesChildren = Object.keys(metaCategories[selectedCategory].children)
        .filter(this.removeBlankCategories);

      if (metaCategoriesChildren.length > 0) {
        return true;
      }
    }
    return false;
  }

  getCategoryCount(selectedCategory) {
    if (this.getSelectedCategories().length > 0) {
      return this.getSelectedCategories().reduce(
        (counter, category) => counter + category.count,
        0
      );
    }

    const categoryCount = this.lookupCategoryFromMeta(selectedCategory);

    return categoryCount && categoryCount.count ? categoryCount.count : 0;
  }

  getChildrenCategories(selectedCategory) {
    const metaCategories = this.state.currentCategories || this.props.categoryMetaData.categories;

    const childrenCategories = metaCategories[selectedCategory] && metaCategories[selectedCategory].children;

    const updateState = (currentCategories) => {
      this.setState({
        selectedCategories: this.state.selectedCategories.concat(selectedCategory),
        selectedCategory,
        currentCategories,
      });
    };

    if (childrenCategories) {
      const metaCategoriesChildren = Object.keys(childrenCategories)
        .filter(this.removeBlankCategories);

      if (metaCategoriesChildren.length > 0) {
        updateState(childrenCategories);
        return;
      }
    }

    updateState({});
  }

  getSelectedCategories() {
    if (this.state.currentCategories) {
      const newCategories = Object.keys(this.state.currentCategories)
        .filter(this.removeBlankCategories)
        .map(category => {
          return {
            category,
            count: this.state.currentCategories[category].count,
            children: this.state.currentCategories[category].children,
          };
        });
      return newCategories;
    }
    return [];
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
