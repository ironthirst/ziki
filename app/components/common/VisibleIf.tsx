import React from "react";

type Props = {
  cond: boolean;
  component?: React.FunctionComponent;
  render?: () => React.ReactElement;
};

export function VisibleIf(props: Props) {
  const { cond, component: Component, render } = props;
  if (!cond) return null;
  if (render) return render();
  if (Component) return <Component />;
  return null;
}
