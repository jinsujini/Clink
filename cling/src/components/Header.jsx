import React from 'react'
import LOGO from '../assets/img/logo.png'
import '../assets/scss/section/Header.scss'
import '../assets/scss/section/base.scss'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='header'>
      <Link to='/mainhome' className="logo">
                <img src={LOGO} alt="logo" />
            </Link>
      <div className="nav">
        <Link to = '/mainhome'> <button className='Home'>HOME</button></Link>
        <Link to= '/login'><button className='login nodisplay'>LOGIN</button></Link>
        <Link to= '/match' ><button className='Matching'>MATCHING</button></Link>
        <Link to = '/crew' ><button className='Crew'>CREW</button></Link>
        <Link  to = '/myhome'><button  className='My'>MY</button></Link>
      </div>
    </div>
  )
}

export default Header
