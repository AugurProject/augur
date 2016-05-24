import React from 'react'
import DISQUS from 'disqus'

module.exports = React.createClass({
    propTypes: {
        identifier: React.PropTypes.string,
        title: React.PropTypes.string
    },

    componentDidMount(){
        this.configureDisqus()
    },

    componentDidUpdate(){
        this.configureDisqus()
    },

    render: function(){
        return <div id="disqus_thread" className="disqus-container"/>
    },

    configureDisqus(){
        let p = this.props

        DISQUS.reset({
            reload: true,
            config: function(){
                this.page.identifier = p.identifier
                this.page.title = p.title
                this.page.url = window.location.href
            }
        })
    }
});