import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV__LINKS = [
    {
      display: "home",
      url: "/home",
    },
    {
      display: "marketplace",
      url: "/marketplace",
    },
    {
      display: "contact",
      url: "/contact",
    },
  ];

const Navigation = () => {
  return (
    <nav>
        <ul className="nav__list">
              {NAV__LINKS.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
    </nav>
  )
}

export default Navigation
