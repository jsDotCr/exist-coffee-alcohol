import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

interface HomeProps {
  existToken: String,
  hasCode: Boolean
}

export class Home extends React.Component<HomeProps, {}> {
  render () {
    const { existToken, hasCode } = this.props
    if (!existToken) {
      return (
        <Redirect to='/connect' />
      )
    }

    return (
      <section>
        <h2>Connected!</h2>
      </section>
    )
  }
}

function mapStateToProps (state) {
  return {
    hasToken: !!state.exist.accessToken
  }
}

export default connect(mapStateToProps)(withRouter(Home))
