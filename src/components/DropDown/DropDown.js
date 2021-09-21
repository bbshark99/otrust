import React, { useState } from 'react';
import styled from 'styled-components';

const DropDownWrapper = styled.div`
  color: ${props => props.theme.colors.textPrimary};
  background-color: ${props =>
    props.isOpened ? props.theme.colors.bgHighlightBorder : 'transparent'};
  border-radius: ${props => (props.isOpened ? '6px 6px 0 0' : '6px')};
`;

const DropDownText = styled.div`
  min-width: 120px;
  color: white;
  font-size: 12px;
  padding: 13px 16px;
  cursor: pointer;
  height: auto;
  border-radius: ${props => (props.isOpened ? '6px 6px 0 0' : '6px')};
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  &::after {
    content: '';
    transition: all 0.3s;
    border: solid #ccc;
    border-width: 0 1px 1px 0;
    float: right;
    padding: 5px;
    margin: ${props => (props.isOpened ? '1px 6px 8px 0' : '8px 6px 8px 0')};
    transform: ${props => (props.isOpened ? 'rotate(45deg)' : 'rotate(-135deg)')};
  }
`;

const DropDownItem = styled.div`
  cursor: pointer;
  font-size: 12px;
  position: relative;
  padding: ${props => (props.isOpened ? '6px 18px' : 0)};
  height: ${props => (props.isOpened ? 'auto' : 0)};
  visibility: ${props => (props.isOpened ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpened ? 1 : 0)};
  transition: ${props =>
    props.isOpened ? 'max-height 0.7s, opacity 2s, visibility 3s ease' : 'all 0s ease 0s'};
  &:hover {
    background-color: ${props => props.theme.colors.textThirdly_darken};
  }
`;

export default function DropDown({ selectItems, selectHandler }) {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedText, setSelectedText] = useState(selectItems[0].value);

  const handleClick = () => {
    setIsOpened(!isOpened);
  };

  const handleText = (event, key) => {
    if (isOpened) {
      const textValue = event.currentTarget.textContent;
      setSelectedText(textValue);
      setIsOpened(!isOpened);
      selectHandler(key);
    }
  };

  return (
    <DropDownWrapper isOpened={isOpened}>
      <DropDownText isOpened={isOpened} onClick={handleClick}>
        {selectedText}
      </DropDownText>
      {selectItems.map(item => (
        <DropDownItem
          isOpened={isOpened}
          onClick={event => handleText(event, item.key)}
          key={item.key}
        >
          {item.value}
        </DropDownItem>
      ))}
    </DropDownWrapper>
  );
}
