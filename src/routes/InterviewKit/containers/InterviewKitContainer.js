import React, { PropTypes } from 'react'
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core'
import { connect } from 'react-redux'

import { switchView } from '../modules/view'
import ViewEnums from '../enums/ViewEnums'

class InterviewKit extends React.Component {
  constructor (props) {
    super(props)
    this.handleNewInterviewClick = this.handleNewInterviewClick.bind(this)
    this.handleLibraryClick = this.handleLibraryClick.bind(this)
    this.handleDraftsClick = this.handleDraftsClick.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (view) {
    this.props.switchView(view)
  }

  handleNewInterviewClick () {
    this.handleClick(ViewEnums.NEW_INTERVIEW)
  }

  handleLibraryClick () {
    this.handleClick(ViewEnums.LIBRARY)
  }

  handleDraftsClick () {
    this.handleClick(ViewEnums.DRAFTS)
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-2'>
          <Menu>
            <MenuItem
              iconName='new-text-box'
              text='New Interview'
              onClick={this.handleNewInterviewClick} />
            <MenuItem
              iconName='box'
              text='Library'
              onClick={this.handleLibraryClick} />
            <MenuItem
              iconName='clipboard'
              text='Drafts'
              onClick={this.handleDraftsClick} />
            <MenuDivider />
            <MenuItem text='Settings...' iconName='cog' />
          </Menu>
        </div>
        <div className='col-md-10'>
          <p> {this.props.view} </p>
        </div>
      </div>
    )
  }
}

InterviewKit.propTypes = {
  switchView: PropTypes.func,
  view: PropTypes.string
}

const mapStateToProps = (state) => ({
  view: state.view
})

const mapDispatchToProps = (dispatch) => ({
  switchView (newView) {
    dispatch(switchView(newView))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterviewKit)
