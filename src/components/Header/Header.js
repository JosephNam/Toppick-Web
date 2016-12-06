import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>Toppick Development Universe</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/interviewkit' activeClassName='route--active'>
      Interview Kit
    </Link>
  </div>
)

export default Header
