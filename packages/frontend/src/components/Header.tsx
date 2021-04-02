import React from "react";

interface HeaderProps {
  text: string;
}

/**
 * Header is an SVG element for possible later SVG animation purposes.
 */
const Header: React.FC<HeaderProps> = (props: HeaderProps) => {

  return (
    <h1 className="header">
      {props.text}
    </h1>
  );
};

export default Header;
