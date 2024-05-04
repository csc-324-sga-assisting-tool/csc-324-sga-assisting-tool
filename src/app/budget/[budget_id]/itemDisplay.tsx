'use client';
import {FiX, FiCheck} from 'react-icons/fi';
import {Item, Budget, User, userIsSGA} from 'lib/data';
import {Button, Table} from 'flowbite-react';
import {ItemRowActions} from './itemRowActions';
import {Color} from 'lib/color.types';

function ItemRowDenyButton({
  item,
  toggleDenyItemAction,
}: {
  item: Item;
  toggleDenyItemAction: (item: Item) => Promise<void>;
}) {
  return (
    <Button
      onClick={() => toggleDenyItemAction(item)}
      className="bg-pallete-5 w-full"
    >
      {item.current_status !== 'denied' && <FiX />}
      {item.current_status === 'denied' && <FiCheck />}
    </Button>
  );
}

function ItemRow(
  item: Item,
  budget: Budget,
  sgaUser: boolean,
  itemRowActions: ItemRowActions
) {
  // RSO only sees whether item is denied after SGA submits denial
  // SGA only sees whether item is denied (by them) when RSO submitted budget
  // but SGA has not yet submitted reviewal
  const rsoShowDenied = !sgaUser && budget.current_status === 'denied';
  const sgaShowDenied = sgaUser && budget.current_status === 'submitted';
  const showDenied = item.current_status === 'denied' && (rsoShowDenied || sgaShowDenied);

  const color = showDenied ? 'bg-pallete-1' : 'bg-white';
  return (
    <Table.Row key={item.id} className={`${color} rounded-none`}>
      <Table.Cell>
        {item.url ? (
          <a href={item.url} target="_blank">
            {item.name}
          </a>
        ) : (
          item.name
        )}
      </Table.Cell>
      <Table.Cell>{item.unit_price}</Table.Cell>
      <Table.Cell>{item.quantity}</Table.Cell>
      <Table.Cell>{item.quantity * item.unit_price}</Table.Cell>
      <Table.Cell>{item.vendor}</Table.Cell>
      <Table.Cell>
        {sgaUser && itemRowActions.toggleDeny !== undefined && (
          <ItemRowDenyButton
            item={item}
            toggleDenyItemAction={itemRowActions.toggleDeny}
          />
        )}
        {!sgaUser && item.current_status === 'denied' ? 'Denied' : 'Approved'}
      </Table.Cell>
    </Table.Row>
  );
}

export function ItemDisplay({
  items,
  budget,
  sgaUser,
  itemRowActions,
}: {
  items: Item[];
  budget: Budget;
  sgaUser: boolean;
  itemRowActions: ItemRowActions;
}) {
  return (
    <div className="overflow-x-auto mt-4 rounded-none">
      <Table className="rounded-none">
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Unit Price</Table.HeadCell>
          <Table.HeadCell>Quantity</Table.HeadCell>
          <Table.HeadCell>Total Cost</Table.HeadCell>
          <Table.HeadCell>Vendor</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {items.map(item => ItemRow(item, budget, sgaUser, itemRowActions))}
        </Table.Body>
      </Table>
    </div>
  );
}
