import React, { FunctionComponent } from "react";
import styled, { keyframes } from "styled-components";

type Props = {
  title?: string;
};

const spinKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9000;
  width: 100%;
  height: 100%;
  background: #ffffff44;
  transition: all 0.2s ease-in-out;
`;

const EclipseLoader = styled.div`
  position: relative;
  top: calc(40vh - 80px);
  height: 80px;
  width: 80px;
  margin: 0 auto;
  animation: ${spinKeyframes} 1.4s linear infinite;
  border-radius: 50%;
  box-shadow: 0 4px 0 0 ${(props) => props.theme.colors.primary};
  transform-origin: 40px 42px;
`;

const LoadingMessage = styled.div`
  position: relative;
  top: calc(40vh - 40px);
  margin: 0 auto;
  text-align: center;
  letter-spacing: 4px;
  line-height: 2;
  color: ${(props) => props.theme.colors.gray50};
`;

export const PageLoadingSpinner: FunctionComponent<Props> = (props) => {
  const { title } = props;
  return (
    <LoaderWrapper>
      <EclipseLoader />
      <LoadingMessage>{title}</LoadingMessage>
    </LoaderWrapper>
  );
};
