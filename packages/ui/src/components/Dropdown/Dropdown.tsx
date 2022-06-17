import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const DropdownWrapper = styled.div<{
  isOpened?: boolean;
}>`
  background-color: ${props =>
    props.isOpened ? props.theme.colors.bgHighlightBorder : 'transparent'};
  border-radius: 6px;

  color: ${props => props.theme.colors.textPrimary};
`;

const DropdownText = styled.div<{
  isOpened?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  min-width: 120px;
  padding: 13px 16px;
  height: 44px;

  border-radius: ${props => (props.isOpened ? '6px 6px 0 0' : '6px')};
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: white;
  font-size: 12px;

  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${props => props.theme.colors.bgHighlightBorder_lighten};
  }

  > svg {
    transform: ${props => (props.isOpened ? 'rotate(180deg)' : 'rotate(0)')};
    transition: transform 0.15s;
  }
`;

const DropdownItem = styled.div<{
  isOpened?: boolean;
}>`
  padding: ${props => (props.isOpened ? '6px 18px 10px' : 0)};
  height: ${props => (props.isOpened ? 'auto' : 0)};

  position: relative;
  visibility: ${props => (props.isOpened ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpened ? 1 : 0)};

  font-size: 12px;

  transition: ${props =>
    props.isOpened ? 'max-height 0.5s, opacity 1s, visibility 2s ease' : 'all 0s ease 0s'};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.bgHighlightBorder_lighten};
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

export default function Dropdown({
  selectItems,
  selectHandler,
}: {
  selectItems: { key: string; value: string }[];
  selectHandler: (key: string) => void;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedText, setSelectedText] = useState(selectItems[0].value);

  const toggleDropdown = () => {
    setIsOpened(!isOpened);
  };

  const selectActiveItem = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    if (isOpened) {
      const textValue = (event.currentTarget as HTMLDivElement).textContent;
      if (textValue) {
        setSelectedText(textValue);
        setIsOpened(!isOpened);
        selectHandler(key);
      }
    }
  };

  return (
    <DropdownWrapper isOpened={isOpened}>
      <DropdownText isOpened={isOpened} onClick={toggleDropdown}>
        <span>{selectedText}</span>
        <FontAwesomeIcon icon={faChevronDown as IconProp} />
      </DropdownText>
      {selectItems.map(item => (
        <DropdownItem
          isOpened={isOpened}
          onClick={event => selectActiveItem(event, item.key)}
          key={item.key}
        >
          {item.value}
        </DropdownItem>
      ))}
    </DropdownWrapper>
  );
}
