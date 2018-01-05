import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import { exchangeCodeForToken } from './duck'

interface ConnectProps {
  code: string,
  exchangeCodeForToken: (code: string) => void,
  hasToken: boolean,
  location: any,
  url: string
}

export class Connect extends React.Component<ConnectProps, {}> {
  componentDidMount() {
    const { location: { search = '' } = {}, exchangeCodeForToken } = this.props
    if (search) {
      const locationParams = new URLSearchParams(search.replace('?', ''))
      if (locationParams.has('code')) {
        exchangeCodeForToken(locationParams.get('code'))
      }
    }
  }

  render () {
    if (this.props.hasToken) {
      return (
        <Redirect to='/track' />
      )
    }
    if (this.props.code) {
      return (
        <h1>got a code {this.props.code}</h1>
      )
    }

    return (
      <section>
        <h2>Connect with Exist</h2>
        <a href={this.props.url}>Connect</a>
      </section>
    )
  }
}

function mapStateToProps (state) {
  return {
    hasToken: !!state.exist.accessToken,
    url: state.exist.authorizeUrl
  }
}

const mapDispatchToProps = {
  exchangeCodeForToken
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Connect))
