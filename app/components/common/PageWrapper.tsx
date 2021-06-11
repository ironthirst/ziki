import styled from "styled-components";

export const PageWrapper = styled.div<{
  landscape?: boolean;
  portrait?: boolean;
}>`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  @media print {
    @page {
      size: ${(props) =>
        props.landscape ? "landscape" : props.portrait ? "portrait" : "auto"};
    }
  }
`;
