import { memo, useMemo } from 'react';
import { Table, Center } from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK } from '../../../../../Base/BaseColor.jsx';
import { TableText } from '../../../../../Base/Extensions.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';

export const ClusterTable = memo(function ClusterTable({ clusterData }) {
  const { colorMode } = useColorMode();

  const sumCPUs = useMemo(() => clusterData?.reduce((sum, item) => sum + item?.cpu_total, 0), [clusterData]);
  const sumRAMs = useMemo(() => clusterData?.reduce((sum, item) => sum + item?.ram_total, 0), [clusterData]);
  const sumDISKs = useMemo(() => clusterData?.reduce((sum, item) => sum + item?.disk_total, 0), [clusterData]);

  return (
    <Table.Root size={'lg'} stickyHeader>
      <Table.Header>
        <Table.Row backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}>
          <Table.ColumnHeader py={1} color={'gray.600'} fontSize={'16px'} fontWeight={'bold'}>
            <Center>CPUs</Center>
          </Table.ColumnHeader>
          <Table.ColumnHeader py={1} color={'gray.600'} fontSize={'16px'} fontWeight={'bold'}>
            <Center>RAMs</Center>
          </Table.ColumnHeader>
          <Table.ColumnHeader py={1} color={'gray.600'} fontSize={'16px'} fontWeight={'bold'}>
            <Center>DISKs</Center>
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row backgroundColor={colorMode === 'light' ? 'transparent' : MENU_BACKGROUND_DARK}>
          <Table.Cell py={3} px={4}>
            <TableText cursor={'default'} text={sumCPUs} copyable={false} maxLength={20} />
          </Table.Cell>
          <Table.Cell py={3} px={4}>
            <TableText cursor={'default'} text={`${sumRAMs} GB`} copyable={false} maxLength={20} />
          </Table.Cell>
          <Table.Cell py={3} px={4}>
            <TableText cursor={'default'} text={`${sumDISKs} GB`} copyable={false} maxLength={20} />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
});
