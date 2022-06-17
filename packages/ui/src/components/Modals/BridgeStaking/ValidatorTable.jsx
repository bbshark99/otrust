/* eslint-disable react/jsx-key */
import React from 'react';
import styled, { css } from 'styled-components/macro';
import { useTable, useSortBy } from 'react-table';
import { Scrollbars } from 'react-custom-scrollbars';
import { useValidatorList } from '@onomy/react-hub';

import { SortBy } from '../Icons';
import { FormattedNumber } from 'components/FormattedNumber';
import { ErrorDisplay } from 'components/ErrorDisplay';
import LoadingSpinner from 'components/UI/LoadingSpinner';

const StyledTable = styled.table`
  width: 100%;

  thead {
    display: block;

    margin-bottom: 24px;
    padding: 16px 0;

    border-top: 1px solid #302e3d;
    border-bottom: 1px solid #302e3d;

    tr {
      display: grid;
      grid-template-columns: 6fr 4fr 2fr;
      justify-items: start;

      width: 100%;

      th {
        display: flex;
        align-items: center;
        gap: 6px;

        font-size: 12px;
        font-weight: 400;
        color: ${props => props.theme.colors.textSecondary};

        user-select: none;
      }
    }
  }

  tbody {
    display: flex;
    flex-direction: column;
    gap: 40px;

    max-height: 440px;
  }
`;

const sortedMixin = css`
  .arrow-up {
    fill: ${props =>
      props.sortedDesc ? props.theme.colors.textSecondary : props.theme.colors.textPrimary};
  }

  .arrow-down {
    fill: ${props =>
      props.sortedDesc ? props.theme.colors.textPrimary : props.theme.colors.textSecondary};
  }
`;

const SortIconWrapper = styled.span`
  height: 16px;

  svg path {
    fill: ${props => props.theme.colors.textSecondary};
  }

  ${props => (props.sorted ? sortedMixin : '')};
`;

const Validator = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  > img {
    border-radius: 4px;
  }
`;

const ValidatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.textPrimary};
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ValidatorRow = styled.tr`
  display: grid;
  grid-template-columns: 6fr 4fr 2fr;
  align-items: center;

  width: 100%;

  background-color: ${props =>
    props.active ? props.theme.colors.bgHighlightBorder : 'transparent'};

  cursor: pointer;

  &:hover {
    background-color: ${props =>
      props.active ? props.theme.colors.bgHighlightBorder : props.theme.colors.bgNormal};
  }
`;

const APR = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  color: ${props => props.theme.colors.highlightBlue};
  font-weight: 500;
`;

const APRFee = styled.div`
  opacity: 0.4;

  font-size: 12px;
`;

const Delegated = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-family: Bebas Neue, sans-serif;
    font-size: 20px;
    color: ${props => props.theme.colors.textPrimary};
  }

  span {
    font-size: 12px;
    font-weight: 500;
  }
`;

const columns = [
  {
    Header: 'Name',
    accessor: 'validator',
    Cell: ({ value }) => (
      <Validator>
        {/* <img src="https://picsum.photos/64/72" alt="" /> */}
        {/* {value.img} */}
        <ValidatorContent>
          <strong>{value.name}</strong>
          <span>
            Voting Power Share: <FormattedNumber value={value.votingPower} />%
          </span>
        </ValidatorContent>
      </Validator>
    ),
  },
  {
    Header: 'APR',
    accessor: 'rewards',
    Cell: ({ value }) => (
      <APR>
        <div>{value.APR.toFixed(2)}%</div>
        <APRFee>{value.commissionRate.toFixed(2)}% fee</APRFee>
      </APR>
    ),
  },
  {
    Header: 'Delegated',
    accessor: 'delegated',
    Cell: ({ value }) => (
      <Delegated>
        <strong>
          <FormattedNumber value={value} />
        </strong>
      </Delegated>
    ),
  },
];

export default function ValidatorTable({ selected, setSelected }) {
  const [data, { error, pending }] = useValidatorList();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  if (error) return <ErrorDisplay error={error} />;
  if (pending) return <LoadingSpinner />;

  return (
    <StyledTable {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <SortIconWrapper sorted={column.isSorted} sortedDesc={column.isSortedDesc}>
                  <SortBy />
                </SortIconWrapper>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <Scrollbars style={{ height: 440, width: 'auto' }}>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);

            return (
              <ValidatorRow
                {...row.getRowProps()}
                active={row.original.id === selected}
                onClick={() => setSelected(row.original.id)}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </ValidatorRow>
            );
          })}
        </tbody>
      </Scrollbars>
    </StyledTable>
  );
}
