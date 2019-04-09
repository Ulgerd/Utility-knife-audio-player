import React, { Component } from 'react';
import Icons from "../icons/icons.svg";
import '../App.css';

class Button extends Component {
  render() {
    let {name, color, size, onClick, disabled} = this.props;
    let buttonClass = disabled ? ' disabled': '';
    return(
      <div
        className={'button unselectable' + buttonClass}
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
