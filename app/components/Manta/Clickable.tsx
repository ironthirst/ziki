import React, { FunctionComponent } from "react";

import styled from "styled-components";

const ClickableElement = styled.a`
  cursor: pointer;
  display: inline-block;
`;

type Props = {
  onClick: () => void;
} & React.HTMLAttributes<HTMLAnchorElement>;

export const Clickable: FunctionComponent<Props> = (props) => {
  const { onClick, children, ...rest } = props;
  return (
    <ClickableElement
      {...rest}
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </ClickableElement>
  );
};
