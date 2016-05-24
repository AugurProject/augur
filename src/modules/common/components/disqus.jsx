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
        return (
            <div className='disqus-container' >
                <div id="disqus_thread" />
                <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
            </div>
        )
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
            SCRIPT.src = '//augur.disqus.com/embed.js'

            document.body.appendChild(SCRIPT)
        }
    }
});