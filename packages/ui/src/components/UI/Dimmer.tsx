import styled from 'styled-components';

export const Dimmer = styled.div<{
  disabled?: boolean;
}>`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.7);

  z-index: 10;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;
