import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// TODO: implement null state for topics list (needs design)
// import NullStateMessage from 'modules/common/components/null-state-message';
import TopicList from 'modules/topics/components/topic-list/topic-list'
import Paginator from 'modules/common/components/paginator/paginator'
import GraphBG from 'modules/common/components/graph-background/graph-background'

import makePath from 'modules/app/helpers/make-path'
import makeQuery from 'modules/app/helpers/make-query'

import Styles from 'modules/topics/components/topics-view/topics-view.styles'

import { TOPIC_PARAM_NAME } from 'modules/app/constants/param-names'
import { MARKETS } from 'modules/app/constants/views'

import { tween } from 'shifty'

export default class TopicsView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    topics: PropTypes.array,
    branch: PropTypes.object,
    loginAccount: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      lowerBound: null,
      upperBound: null,
      boundedLength: null,
      itemsPerPage: 9,
      filteredTopics: [],
      filteredTopicsLength: 0,
      hasKeywords: false,
      paginatedTopics: [],
      pagination: {},
      fontAwesomeClasses: [],
      icoFontClasses: [],
      heroTopicIndex: null,
      heroTopicOpacity: 0
    }

    this.setSegment = this.setSegment.bind(this)
    this.startCategoryCarousel = this.startCategoryCarousel.bind(this)
    this.stopCategoryCarousel = this.stopCategoryCarousel.bind(this)
  }

  componentDidMount() {
    if (this.props.topics.length > 0) {
      this.startCategoryCarousel()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topics.length === 0 && nextProps.topics.length > 0) {
      this.startCategoryCarousel()
    }
  }

  componentWillUnmount() {
    this.stopCategoryCarousel()
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, upperBound, boundedLength })
  }

  startCategoryCarousel() {
    this.setState({ heroTopicIndex: 0 })

    const doCarouselTween = (from, to, cb) => tween({
      from: { value: from },
      to: { value: to },
      duration: 500,
      easing: 'easeOutQuad',
      step: (stepObj) => {
        this.setState({ heroTopicOpacity: stepObj.value })
      }
    }).then(cb)

    const waitThenChange = () => {
      this.carouselTimeout = setTimeout(() => {
        doCarouselTween(1, 0, () => {
          const s = this.state
          const p = this.props
          const nextIndex = (s.heroTopicIndex + 1) % p.topics.length
          this.setState({ heroTopicIndex: nextIndex })
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

    const heroTopic = p.topics[s.heroTopicIndex]

    return (
      <section className={Styles.Topics}>
        <GraphBG />
        <div className={Styles.Topics__container}>
          <div className={Styles.TopicsHeading}>
            <h3>Bet on...</h3>
            <h2 style={{ opacity: s.heroTopicOpacity }}>
              {heroTopic &&
                <Link
                  to={{
                    pathname: makePath(MARKETS),
                    search: makeQuery({
                      [TOPIC_PARAM_NAME]: heroTopic.topic
                    })
                  }}
                >
                  {heroTopic.topic}
                </Link>
              }
              {!heroTopic && '...'}
            </h2>
            <div className={Styles.TopicsHeading__separator} />
          </div>
          {(p.topics && p.topics.length && s.boundedLength) &&
            <TopicList
              topics={p.topics}
              lowerBound={s.lowerBound}
              boundedLength={s.boundedLength}
            />
          }
          {(p.topics && p.topics.length) &&
            <Paginator
              itemsLength={p.topics.length}
              itemsPerPage={s.itemsPerPage}
              location={p.location}
              history={p.history}
              setSegment={this.setSegment}
            />
          }
        </div>
      </section>
    )
  }
}
