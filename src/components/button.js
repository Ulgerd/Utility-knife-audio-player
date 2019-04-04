import React, { Component } from 'react';
import Icons from "../icons/icons.svg";
import '../App.css';

class Button extends Component {
  render() {
    let {name, color, size, onClick} = this.props;
    return(
      <div
        className='button unselected'
        onClick={e => onClick(e)}
      >
        <svg
          className={`icon icon-${name}`}
          fill={color}
          width={size}
          height={size}
        >
          <use xlinkHref={`${Icons}#icon-${name}`} />
        </svg>
      </div>
    )
  }

}

export default Button;
