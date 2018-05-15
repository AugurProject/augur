import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { createBigNumber } from 'utils/create-big-number'
import CategoryList from 'modules/categories/components/category-list/category-list'
import Paginator from 'modules/common/components/paginator/paginator'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import Styles from 'modules/categories/components/categories-view/categories-view.styles'

import { CATEGORY_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { MARKETS } from 'modules/routes/constants/views'

import { tween } from 'shifty'

export default class CategoriesView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    categories: PropTypes.array,
    universe: PropTypes.object,
    loginAccount: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      lowerBound: null,
      boundedLength: null,
      itemsPerPage: 9,
      heroCategoryIndex: null,
      heroCategoryOpacity: 0,
    }

    this.setSegment = this.setSegment.bind(this)
    this.startCategoryCarousel = this.startCategoryCarousel.bind(this)
    this.stopCategoryCarousel = this.stopCategoryCarousel.bind(this)
  }

  componentDidMount() {
    const { categories } = this.props
    if (categories.length > 0) {
      this.startCategoryCarousel()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { categories } = this.props
    if (categories.length === 0 && nextProps.categories.length > 0) {
      this.startCategoryCarousel()
    }
  }

  componentWillUnmount() {
    this.stopCategoryCarousel()
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({
      lowerBound,
      boundedLength,
    })
  }

  startCategoryCarousel() {
    this.setState({ heroCategoryIndex: 0 })

    const doCarouselTween = (from, to, cb) => tween({
      from: { value: from },
      to: { value: to },
      duration: 500,
      easing: 'easeOutQuad',
      step: (stepObj) => {
        this.setState({ heroCategoryOpacity: stepObj.value })
      },
    }).then(cb)

    const waitThenChange = () => {
      this.carouselTimeout = setTimeout(() => {
        doCarouselTween(1, 0, () => {
          const { heroCategoryIndex } = this.state
          const { categories } = this.props
          if (categories.length > 0) {
            const nextIndex = createBigNumber(heroCategoryIndex).plus(createBigNumber(1)).mod(createBigNumber(categories.length)).toNumber()
            this.setState({ heroCategoryIndex: nextIndex })
          }
          doCarouselTween(0, 1, waitThenChange)
        })
      }, 5000)
    }
    doCarouselTween(0, 1, waitThenChange)
  }

  stopCategoryCarousel() {
    if (this.carouselTimeout) {
      clearTimeout(this.carouselTimeout)
      this.carouselTimeout = null
    }
  }

  render() {
    const {
      categories,
      history,
      isMobile,
      location,
    } = this.props
    const {
      heroCategoryIndex,
      heroCategoryOpacity,
      boundedLength,
      lowerBound,
      itemsPerPage,
    } = this.state
    const heroCategory = categories[heroCategoryIndex]

    return (
      <section className={Styles.Categories}>
        <Helmet>
          <title>Categories</title>
        </Helmet>

        <div className={Styles.Categories__container}>
          <div className={Styles.CategoriesHeading}>
            <h3>Bet on</h3>
            {heroCategory &&
            <h2 style={{ opacity: heroCategoryOpacity }}>
              {heroCategory &&
                <Link
                  to={{
                    pathname: makePath(MARKETS),
                    search: makeQuery({
                      [CATEGORY_PARAM_NAME]: heroCategory.category,
                    }),
                  }}
                >
                  {heroCategory.category}
                </Link>
              }
              {!heroCategory && '...'}
            </h2>
            }
            <div className={Styles.CategoriesHeading__separator} />
          </div>
          {!!(categories && categories.length && boundedLength) &&
            <CategoryList
              categories={categories}
              lowerBound={lowerBound}
              boundedLength={isMobile ? boundedLength : itemsPerPage}
            />
          }
        </div>
        {!!(categories && categories.length) &&
          <div className={Styles.Categories__paginator}>
            <Paginator
              itemsLength={categories.length}
              itemsPerPage={itemsPerPage}
              location={location}
              history={history}
              setSegment={this.setSegment}
            />
          </div>
        }
      </section>
    )
  }
}
