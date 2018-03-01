import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

// TODO: implement null state for categories list (needs design)
// import NullStateMessage from 'modules/common/components/null-state-message';
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
    if (this.props.categories.length > 0) {
      this.startCategoryCarousel()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.categories.length === 0 && nextProps.categories.length > 0) {
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
          const s = this.state
          const p = this.props
          const nextIndex = (s.heroCategoryIndex + 1) % p.categories.length
          this.setState({ heroCategoryIndex: nextIndex })
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
    const p = this.props
    const s = this.state
    const heroCategory = p.categories[s.heroCategoryIndex]

    return (
      <section className={Styles.Categories}>
        <Helmet>
          <title>Categories</title>
        </Helmet>

        <div className={Styles.Categories__container}>
          <div className={Styles.CategoriesHeading}>
            <h3>Bet on</h3>
            {heroCategory &&
            <h2 style={{ opacity: s.heroCategoryOpacity }}>
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
          {!!(p.categories && p.categories.length && s.boundedLength) &&
            <CategoryList
              categories={p.categories}
              lowerBound={s.lowerBound}
              boundedLength={p.isMobile ? s.boundedLength : s.itemsPerPage}
            />
          }
        </div>
        {!!(p.categories && p.categories.length) &&
          <div className={Styles.Categories__paginator}>
            <Paginator
              itemsLength={p.categories.length}
              itemsPerPage={s.itemsPerPage}
              location={p.location}
              history={p.history}
              setSegment={this.setSegment}
            />
          </div>
        }
      </section>
    )
  }
}
