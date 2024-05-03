'use client';

import {FiX, FiCheck} from 'react-icons/fi';
import {Item} from 'lib/data';
import {Button, Table} from 'flowbite-react';
import {ItemRowActions} from './itemRowActions';
import {Color} from 'lib/color.types';

function ItemRowDenyButton({
  item,
  toggleDenyItemAction,
}: {
  item: Item;
  toggleDenyItemAction: (item: Item) => void;
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

function ItemRow(item: Item, itemRowActions: ItemRowActions) {
  const color = item.current_status === 'denied' ? 'bg-pallete-1' : 'bg-white';
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
        {itemRowActions.toggleDeny !== undefined && (
          <ItemRowDenyButton
            item={item}
            toggleDenyItemAction={itemRowActions.toggleDeny}
          />
        )}
        {itemRowActions.toggleDeny === undefined &&
        item.current_status === 'denied'
          ? 'Denied'
          : 'Approved'}
      </Table.Cell>
    </Table.Row>
  );
}

export function ItemDisplay({
  items,
  itemRowActions,
}: {
  items: Item[];
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
          {items.map(item => ItemRow(item, itemRowActions))}
        </Table.Body>
      </Table>
    </div>
  );
}
