'use client';

import {Item} from 'lib/data';
import {Table} from 'flowbite-react';

function ItemRow(item: Item) {
  return (
    <Table.Row key={item.id} className="bg-white rounded-none">
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
    </Table.Row>
  );
}

export function ItemDisplay({items}: {items: Item[]}) {
  return (
    <div className="overflow-x-auto mt-4 rounded-none">
      <Table hoverable striped className="rounded-none">
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
          {items.map(item => ItemRow(item))}
        </Table.Body>
      </Table>
    </div>
  );
}
