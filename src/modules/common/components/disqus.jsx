import React from 'react'

module.exports = React.createClass({
    propTypes: {
        identifier: React.PropTypes.string,
        title: React.PropTypes.string
    },

    componentDidMount(){
        this.loadDisqus()
    },

    componentDidUpdate(){
        this.loadDisqus()
    },

    render: function(){
        return <div id="disqus_thread" className="disqus-container"/>
    },

    loadDisqus(){
        let p = this.props

        if(typeof DISQUS !== 'undefined'){ // Disqus already added, need to reset
            DISQUS.reset({
                reload: true,
                config: function(){
                    this.page.identifier = p.identifier
                    this.page.title = p.title
                    this.page.url = window.location.href
                }
            })
        }else{
            window['disqus_identifier'] = p.identifier
            window['disqus_title'] = p.title
            window['disqus_url'] = window.location.href

            // Append Disqus Script
            const SCRIPT = document.createElement('script')

            SCRIPT.async = true
            SCRIPT.type = 'text/javascript'
            SCRIPT.src = '//augur-markets.disqus.com/embed.js'

            document.body.appendChild(SCRIPT)
        }
    }
});