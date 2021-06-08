import React from "react";
import styled from "styled-components";

type Props = {
  block?: boolean;
  outline?: boolean;
  // color
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  warning?: boolean;
  info?: boolean;
  success?: boolean;
  // secondary-colors
  light?: boolean;
  dark?: boolean;
  muted?: boolean;
  white?: boolean;
  // nuke color
  nukeColor?: string;
  // size
  small?: boolean;
  large?: boolean;
} & React.HTMLProps<HTMLButtonElement>;

const BaseButton = styled.button<{ nukeColor?: string }>`
  ${(props) => {
    if (!props.nukeColor) return "";
    return `
      color: white;
      background-color: ${props.nukeColor};
      border-color: ${props.nukeColor};
      :hover,
      :active,
      :visited,
      :focus {
        background-color: ${props.nukeColor};
        border-color: ${props.nukeColor};
        color: white;
      }
    `;
  }}
`;

export function Button(props: Props) {
  const {
    type,
    className,
    primary,
    secondary,
    danger,
    warning,
    info,
    success,
    light,
    dark,
    muted,
    white,
    block,
    outline,
    children,
    large,
    small,
    nukeColor,
    as,
    ref,
    ...rest
  } = props;

  const classNames = ["btn"];
  if (block) classNames.push("btn-block");
  if (small) classNames.push("btn-sm");
  if (large) classNames.push("btn-lg");

  if (primary) classNames.push(`btn-${outline ? "outline-" : ""}primary`);
  if (secondary) classNames.push(`btn-${outline ? "outline-" : ""}secondary`);
  if (danger) classNames.push(`btn-${outline ? "outline-" : ""}danger`);
  if (warning) classNames.push(`btn-${outline ? "outline-" : ""}warning`);
  if (info) classNames.push(`btn-${outline ? "outline-" : ""}info`);
  if (success) classNames.push(`btn-${outline ? "outline-" : ""}success`);
  if (light) classNames.push(`btn-${outline ? "outline-" : ""}light`);
  if (dark) classNames.push(`btn-${outline ? "outline-" : ""}dark`);
  if (muted) classNames.push(`btn-${outline ? "outline-" : ""}muted`);
  if (white) classNames.push(`btn-${outline ? "outline-" : ""}white`);

  return (
    <BaseButton
      nukeColor={nukeColor}
      className={classNames.join(" ")}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}
