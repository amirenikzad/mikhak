import { Box, Button, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { lazy, Suspense } from 'react';
import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { User } from '../../../../../Base/Extensions.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { ChevronRightOutlineIcon } from '../../../../../Base/CustomIcons/ChevronRightOutlineIcon.jsx';

const MapComponent = lazy(() => import('../../../../../Base/MapComponent.jsx'));

export const NodeInfo = ({ selectedNode, expand, setExpand }) => {
  const { colorMode } = useColorMode();

  return (
    <Box zIndex={2}
         pl={6}
         width={expand ? '370px' : '50px'}
         h={'94dvh'}
         dir={'rtl'}
         position={'absolute'}
         overflow={'hidden'}
         right={0}
         backgroundColor={colorMode === 'light' ? 'white' : 'transparent'}
         borderWidth={1}
         borderRadius={0}
         boxShadow={'lg'}
         transition={'all 0.4s ease'}>
      <Stack>
        <Grid templateColumns={'repeat(3, 1fr)'} gap={6}>
          <GridItem colSpan={expand ? 1 : 2}>
            <Button p={0}
                    w={'20px'}
                    h={'40px'}
                    mr={'3px'}
                    transition={'all 0.2s ease'}
                    transform={expand ? 'rotate(0deg)' : 'rotate(180deg)'}
                    bgColor={'transparent'}
                    borderRadius={'100%'}
                    _hover={{ backgroundColor: 'gray.200' }}
                    onClick={() => setExpand(!expand)}>
              <ChevronRightOutlineIcon color={colorMode === 'light' ? 'black' : 'white'} width={'1.5rem'} />
            </Button>
          </GridItem>

          <GridItem hidden={!expand}
                    opacity={expand ? 1 : 0}
                    colSpan={expand ? 2 : 0}
                    my={'auto'}
                    dir={'ltr'}>
            <Text fontWeight={'700'} cursor={'default'}>{giveText(281)}</Text>
          </GridItem>
        </Grid>

        <Box transition={'all 0.6s ease'} position={'absolute'} top={10} right={expand ? '-50px' : '13px'}>
          <Text cursor={'default'} style={{ writingMode: 'tb-rl' }} fontSize={'18px'}>
            {giveText(280)}
          </Text>
        </Box>
      </Stack>

      <Stack hidden={!expand} spacing={4} px={4} mt={4}>
        <User cursor={'default'}
              dir={giveDir()}
              copyable={false}
              userInfo={{
                username: selectedNode?.name,
                profile_pic: selectedNode?.logo,
                email: selectedNode?.email,
              }} />

        <Stack spacing={3}>
          <Grid templateColumns="repeat(2, 1fr)" gap={5}>
            <GridItem colSpan={1} my={'auto'}>
              <Text fontWeight={'700'} color={colorMode === 'light' ? 'blue.600' : 'blue.400'} cursor={'default'}>
                {giveText(35)}:
              </Text>
            </GridItem>

            <GridItem colSpan={1} my={'auto'}>
              <Text cursor={'default'}>{selectedNode?.address}</Text>
            </GridItem>
          </Grid>
          <Grid templateColumns="repeat(2, 1fr)" gap={5}>
            <GridItem colSpan={1} my={'auto'}>
              <Text fontWeight={'700'} color={colorMode === 'light' ? 'blue.600' : 'blue.400'} cursor={'default'}>
                {giveText(282)}:
              </Text>
            </GridItem>

            <GridItem colSpan={1} my={'auto'}>
              <Text cursor={'default'}>{selectedNode?.number}</Text>
            </GridItem>
          </Grid>
          <Grid templateColumns="repeat(2, 1fr)" gap={5}>
            <GridItem colSpan={1} my={'auto'}>
              <Text fontWeight={'700'} color={colorMode === 'light' ? 'blue.600' : 'blue.400'} cursor={'default'}>
                {giveText(284)}:
              </Text>
            </GridItem>

            <GridItem colSpan={1} my={'auto'}>
              <Text cursor={'default'}>{selectedNode?.phone_number}</Text>
            </GridItem>
          </Grid>
        </Stack>

        {selectedNode?.lat &&
          <Suspense fallback={'loading...'}>
            <MapComponent zoom={6}
                          selectable={false}
                          height={'200px'}
                          mapOptionsP={0}
                          location={[selectedNode?.lat, selectedNode?.long]} />
          </Suspense>
        }
      </Stack>
    </Box>
  );
};
