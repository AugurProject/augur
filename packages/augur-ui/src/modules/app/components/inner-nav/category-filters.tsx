import React from 'react';
import Styles from 'modules/app/components/inner-nav/category-filters.styles.less';
import { MenuChevron } from 'modules/common/icons';
import { CategoryRow } from 'modules/common/form';
import getValue from 'utils/get-value';
import { CATEGORIES_MAX, CATEGORY_PARAM_NAME } from 'modules/common/constants';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

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
  updateSelectedCategories: Function;
  updateMarketsListMeta: Function;
  selectedCategories: string[];
  history: History;
  location: Location;
}

interface CategoryFiltersState {
  showAllCategories: boolean;
  selectedCategories: string[];
  selectedCategory: string;
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
    if (JSON.stringify(nextProps.categoryMetaData) !== JSON.stringify(this.props.categoryMetaData)) {
      if (nextProps.categoryMetaData && nextProps.categoryMetaData.categories) {
        const newCategory = this.lookupCategoryFromMeta(this.state.selectedCategory, nextProps.categoryMetaData.categories);
        this.setState({
          currentCategories: newCategory ? newCategory.children : null,
        });
      }
    }

    const selectedCategory = parseQuery(nextProps.location.search)[
      CATEGORY_PARAM_NAME
    ];
    const oldSelectedCategory = parseQuery(this.props.location.search)[
      CATEGORY_PARAM_NAME
    ];

    if ((!nextProps.isSearching && !this.state.selectedCategory && nextProps.categoryMetaData && selectedCategory) ||
       (selectedCategory && selectedCategory !== oldSelectedCategory)) {
      this.getChildrenCategories(selectedCategory, [], false);
    }
  }

  componentWillUnmount() {
    this.props.updateSelectedCategories([]);
    this.props.updateMarketsListMeta(null);
  }

  render() {
    const hasSelectedCategories = this.props.selectedCategories && this.props.selectedCategories.length > 0;
    const hasSelectedCategoriesCount = this.props.selectedCategories && this.props.selectedCategories.length;

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
              loading={true}
              count={null} />;
          </div>
        );
      }

      return (
        <div key={idx}>
          <CategoryRow
            category={item.category}
            count={item.count}
            hasChildren={item.count > 0}
            handleClick={() => this.getChildrenCategories(item.category, this.props.selectedCategories)}
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
        {this.props.selectedCategories
          .filter(categories => categories !== this.state.selectedCategory)
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
            category={this.state.selectedCategory}
            count={this.getCategoryCount(this.state.selectedCategory)}
            handleClick={() => null}
            active={true}
            loading={this.props.isSearching}

          />
        </div>
        {this.state.selectedCategory &&
          this.getSelectedCategories().map((item, idx) => {
            return (
              <div key={idx}>
                <CategoryRow
                  category={item.category}
                  count={item.count}
                  loading={this.props.isSearching}
                  handleClick={() => this.getChildrenCategories(item.category, this.props.selectedCategories)}
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
            loading={this.props.isSearching}
            hasChildren={item.count > 0}
            handleClick={() => this.getChildrenCategories(item.category, this.props.selectedCategories)}
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


  removeCategoryQuery () {
    const { history, location } = this.props;

    let updatedSearch = parseQuery(location.search);
    delete updatedSearch[CATEGORY_PARAM_NAME];
    updatedSearch = makeQuery(updatedSearch);

    history.push({
      ...location,
      search: updatedSearch,
    });
  }

  gotoAllCategories() {
    if (this.props.isSearching) return null;

    this.removeCategoryQuery();

    this.props.updateSelectedCategories([]);
    this.setState({
      selectedCategories: [],
      selectedCategory: null,
      currentCategories: this.props.categoryMetaData.categories,
    });
  }

  gotoCategory(selectedCategory) {
    if (this.props.isSearching) return null;
    const indexOfSelected = this.props.selectedCategories.indexOf(selectedCategory);
    const selectedCategories = this.props.selectedCategories.slice(0, indexOfSelected + 1);

    const newCategory = this.lookupCategoryFromMeta(selectedCategory, this.props.categoryMetaData.categories);
    this.props.updateSelectedCategories(selectedCategories);
    this.setState({
      selectedCategories,
      selectedCategory,
      currentCategories: newCategory.children,
    });
  }

  lookupCategoryFromMeta(selectedCategory, categories) {
    const indexOfSelected = this.props.selectedCategories.indexOf(selectedCategory);

    let pathString = '';
    // Used to walk the categories meta data object
    // -> category: {
    //   -> children: {
    //     -> category
    //       -> ...
    for (let i = 0; i <= indexOfSelected; i++) {
      const cat = this.props.selectedCategories[i];
      pathString = pathString + `${ i > 0 ? '.children.' : ''}${cat}`;
    }

    return getValue(categories, pathString);
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
    const categoryCount = this.lookupCategoryFromMeta(selectedCategory, this.props.categoryMetaData.categories);
    return categoryCount && categoryCount.count ? categoryCount.count : 0;
  }

  getChildrenCategories(selectedCategory, selectedCategories, hidden = true) {
    if (this.props.isSearching && hidden) return null;

    const metaCategories = this.state.currentCategories || this.props.categoryMetaData.categories;
    const childrenCategories = metaCategories[selectedCategory] && metaCategories[selectedCategory].children;

    const updateState = (currentCategories) => {
      this.setState({
        selectedCategories: selectedCategories.concat(selectedCategory),
        selectedCategory,
        currentCategories,
      });
      this.props.updateSelectedCategories(selectedCategories.concat(selectedCategory));
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
