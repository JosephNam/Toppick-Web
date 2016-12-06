import React, { PropTypes } from 'react'
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core'
import { connect } from 'react-redux'

import { switchView } from '../modules/view'
import ViewEnums from '../enums/ViewEnums'

const handleClick = (e) => {
  console.log(e)
  switchView(e.id)
}

const InterviewKit = ({ switchView, view }) => (
  <div className='row'>
    <div className='col-md-2'>
      <Menu>
        <MenuItem
          iconName='new-text-box'
          text='New Interview'
          id={ViewEnums.NEW_INTERVIEW}
          onClick={handleClick} />
        <MenuItem
          iconName='box'
          text='Library'
          id={ViewEnums.LIBRARY}
          onClick={handleClick} />
        <MenuItem
          iconName='clipboard'
          text='Drafts'
          id={ViewEnums.DRAFTS}
          onClick={handleClick} />
        <MenuDivider />
        <MenuItem text='Settings...' iconName='cog' />
      </Menu>
    </div>
    <div className='col-md-10'>
      <p> {view} </p>
    </div>
  </div>
)

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
