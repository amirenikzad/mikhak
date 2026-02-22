import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../Base/BaseColor';
import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
import UserFloatingLabelInput from '../../Base/CustomComponets/UserFloatingLabelInput.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { SearchIcon } from '../../Base/CustomIcons/SearchIcon.jsx';
import { memo } from 'react';
import { CircularCrossFillIcon } from '../../Base/CustomIcons/CircularCrossFillIcon.jsx';
import { UserActiveIcon, UserAdminIcon, UserDaemonIcon } from '../../Base/IconsFeatures/Icons.jsx';

export const ProBaseHeaderPage = memo(function ProBaseHeaderPage({
                                                             title,
                                                             description,
                                                             onOpenAdd, addTitle = giveText(9),
                                                             hasAddButton = true,
                                                             searchValue,
                                                             setSearchValue,
                                                             extension,
                                                             addTitleDisabled = false,
                                                             InputRightElementCustom,
                                                             controller,
                                                             hasUserFlagButtons = false,
                                                             activeBtn,
                                                             adminBtn,
                                                             daemonBtn,
                                                             toggleFlag,
                                                           }) {
  const { colorMode } = useColorMode();

  const InputRightElement = (
    <HStack mx={2}>
      {InputRightElementCustom}

      {searchValue &&
        <Box cursor={'pointer'} onClick={() => setSearchValue('')}>
          <CircularCrossFillIcon color={'red'} width={'1rem'} />
        </Box>
      }
    </HStack>
  );

  const UserFlagButtons = hasUserFlagButtons ? (
    <Box
      textAlign="center"
      display="inline-block"
    >
      <HStack>
        <Tooltip
          content={giveText(2)}
          placement="top"
          dir={giveDir()}
        >
        <Box
          bg={activeBtn === true ? '#c5c5c5' : activeBtn === false ? '#a09797' : 'transparent'}
          border="1px solid"
          borderColor="rgba(143, 137, 137, 0.2)"
          onClick={() => toggleFlag('active')}
          h={'40px'}
          w={'40px'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={'5px'}
        >
          <UserActiveIcon isActive={activeBtn} width="2rem" />
        </Box>
        </Tooltip>
        <Tooltip
          content={giveText(3)}
          placement="top"
          dir={giveDir()}
        >
        <Box
          bg={adminBtn === true ? '#c5c5c5' : adminBtn === false ? '#a09797' : 'transparent'}
          border="1px solid"
          borderColor="rgba(143, 137, 137, 0.2)"
          onClick={() => toggleFlag('admin')}
          h={'40px'}
          w={'40px'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={'5px'}
        >
          <UserAdminIcon isAdmin={adminBtn} width="2rem" />
        </Box>
        </Tooltip>

        <Tooltip
          content={giveText(414)}
          placement="top"
          dir={giveDir()}
        >
        <Box
          bg={daemonBtn === true ? '#c5c5c5' : daemonBtn === false ? '#a09797' : 'transparent'}
          border="1px solid"
          borderColor="rgba(143, 137, 137, 0.2)"
          onClick={() => toggleFlag('daemon')}
          h={'40px'}
          w={'40px'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={'5px'}
        >
          <UserDaemonIcon isDaemon={daemonBtn} width="2rem" />
        </Box>
        </Tooltip>

      </HStack>
    </Box>
  ) : null;

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6} px={'2rem'} dir={giveDir()}>
      <GridItem colStart={1} colEnd={2}>
        <Text fontWeight={'800'} fontSize={'22px'} cursor={'default'}>{title}</Text>
        <Text fontWeight={'400'} fontSize={'15px'} cursor={'default'}>{description}</Text>
      </GridItem>

      <GridItem colStart={2} colEnd={3} dir={giveDir(true)} mt={'auto'}>
        <HStack spacing={2}>
          {hasAddButton &&
            <Tooltip bg={'black'}
                     color={'white'}
                     disabled={!addTitleDisabled}
                     content={addTitleDisabled ? giveText(159) : ''}
                     fontWeight={'bold'}>
              <Button borderRadius={5} px={4}
                      disabled={addTitleDisabled}
                      color={colorMode === 'light' ? 'white' : 'black'}
                      backgroundColor={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
                      _hover={{ backgroundColor: colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR }}
                      onClick={onOpenAdd}>
                {addTitle}
              </Button>
            </Tooltip>
          }

          <UserFloatingLabelInput label={giveText(10)}
                              value={searchValue}
                              dir={giveDir()}
                              maxW={'400px'}
                              minW={'400px'}
                              hasInputLeftElement={true}
                              InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
                              hasInputRightElement={true}
                              InputRightElement={InputRightElement}
                              mx={3}
                              onChange={(e) => setSearchValue(e.target.value)}

                              />

          {UserFlagButtons}

          {extension}
        </HStack>
      </GridItem>
    </Grid>
  );
});


// import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
// import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../Base/BaseColor';
// import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
// import UserFloatingLabelInput from '../../Base/CustomComponets/UserFloatingLabelInput.jsx';
// import { useColorMode } from '../../ui/color-mode.jsx';
// import { Tooltip } from '../../ui/tooltip.jsx';
// import { SearchIcon } from '../../Base/CustomIcons/SearchIcon.jsx';
// import { memo } from 'react';
// import { CircularCrossFillIcon } from '../../Base/CustomIcons/CircularCrossFillIcon.jsx';
// import { UserActiveIcon, UserAdminIcon, UserDaemonIcon } from '../../Base/IconsFeatures/Icons.jsx';

// export const ProBaseHeaderPage = memo(function ProBaseHeaderPage({
//                                                              title,
//                                                              description,
//                                                              onOpenAdd, addTitle = giveText(9),
//                                                              hasAddButton = true,
//                                                              searchValue,
//                                                              setSearchValue,
//                                                              extension,
//                                                              addTitleDisabled = false,
//                                                              InputRightElementCustom,
//                                                              controller,
//                                                              hasUserFlagButtons = false,
//                                                              activeBtn,
//                                                              adminBtn,
//                                                              daemonBtn,
//                                                              toggleFlag,
//                                                            }) {
//   const { colorMode } = useColorMode();

//   const InputRightElement = (
//     <HStack mx={2}>
//       {InputRightElementCustom}

//       {searchValue &&
//         <Box cursor={'pointer'} onClick={() => setSearchValue('')}>
//           <CircularCrossFillIcon color={'red'} width={'1rem'} />
//         </Box>
//       }
//     </HStack>
//   );

//   const UserFlagButtons = hasUserFlagButtons ? (
//     <Box
//       textAlign="center"
//       display="inline-block"
//     >
//       <HStack>
//         <Button
//           bg={activeBtn ? 'yellow.400' : 'transparent'}
//           onClick={() => toggleFlag('active')}
//         >
//           <UserActiveIcon width="2rem" />
//         </Button>

//         <Button
//           bg={adminBtn ? 'yellow.400' : 'transparent'}
//           onClick={() => toggleFlag('admin')}
//         >
//           <UserAdminIcon width="2rem" />
//         </Button>

//         <Button
//           bg={daemonBtn ? 'yellow.400' : 'transparent'}
//           onClick={() => toggleFlag('daemon')}
//         >
//           <UserDaemonIcon width="2rem" />
//         </Button>
//       </HStack>
//     </Box>
//   ) : null;

//   return (
//     <Grid templateColumns="repeat(2, 1fr)" gap={6} px={'2rem'} dir={giveDir()}>
//       <GridItem colStart={1} colEnd={2}>
//         <Text fontWeight={'800'} fontSize={'22px'} cursor={'default'}>{title}</Text>
//         <Text fontWeight={'400'} fontSize={'15px'} cursor={'default'}>{description}</Text>
//       </GridItem>

//       <GridItem colStart={2} colEnd={3} dir={giveDir(true)} mt={'auto'}>
//         <HStack spacing={2}>
//           {hasAddButton &&
//             <Tooltip bg={'black'}
//                      color={'white'}
//                      disabled={!addTitleDisabled}
//                      content={addTitleDisabled ? giveText(159) : ''}
//                      fontWeight={'bold'}>
//               <Button borderRadius={5} px={4}
//                       disabled={addTitleDisabled}
//                       color={colorMode === 'light' ? 'white' : 'black'}
//                       backgroundColor={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
//                       _hover={{ backgroundColor: colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR }}
//                       onClick={onOpenAdd}>
//                 {addTitle}
//               </Button>
//             </Tooltip>
//           }

//           <UserFloatingLabelInput label={giveText(10)}
//                               value={searchValue}
//                               dir={giveDir()}
//                               maxW={'400px'}
//                               minW={'400px'}
//                               hasInputLeftElement={true}
//                               InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
//                               hasInputRightElement={true}
//                               InputRightElement={InputRightElement}
//                               mx={3}
//                               onChange={(e) => setSearchValue(e.target.value)}

//                               />

//           {UserFlagButtons}

//           {extension}
//         </HStack>
//       </GridItem>
//     </Grid>
//   );
// });



// // import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
// // import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../Base/BaseColor';
// // import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
// // import UserFloatingLabelInput from '../../Base/CustomComponets/UserFloatingLabelInput.jsx';
// // import { useColorMode } from '../../ui/color-mode.jsx';
// // import { Tooltip } from '../../ui/tooltip.jsx';
// // import { SearchIcon } from '../../Base/CustomIcons/SearchIcon.jsx';
// // import { memo } from 'react';
// // import { CircularCrossFillIcon } from '../../Base/CustomIcons/CircularCrossFillIcon.jsx';
// // import { UserActiveIcon, UserAdminIcon, UserDaemonIcon } from '../../Base/IconsFeatures/Icons.jsx';

// // export const ProBaseHeaderPage = memo(function ProBaseHeaderPage({
// //                                                              title,
// //                                                              description,
// //                                                              onOpenAdd, addTitle = giveText(9),
// //                                                              hasAddButton = true,
// //                                                              searchValue,
// //                                                              setSearchValue,
// //                                                              extension,
// //                                                              addTitleDisabled = false,
// //                                                              InputRightElementCustom,
// //                                                              controller,
// //                                                              hasUserFlagButtons = false,
// //                                                              activeBtn,
// //                                                              adminBtn,
// //                                                              daemonBtn,
// //                                                              toggleFlag,
// //                                                            }) {
// //   const { colorMode } = useColorMode();

// //   const InputRightElement = (
// //     <HStack mx={2}>
// //       {InputRightElementCustom}

// //       {hasUserFlagButtons && (
// //         <Box
// //           textAlign="center"
// //           display="inline-block"
// //         >
// //           <HStack marginLeft={'0px'}>
// //             <Button
// //               bg={activeBtn ? 'yellow.400' : 'transparent'}
// //               onClick={() => toggleFlag('active')}
// //             >
// //               <UserActiveIcon width="2rem" />
// //             </Button>

// //             <Button
// //               bg={adminBtn ? 'yellow.400' : 'transparent'}
// //               onClick={() => toggleFlag('admin')}
// //             >
// //               <UserAdminIcon width="2rem" />
// //             </Button>

// //             <Button
// //               bg={daemonBtn ? 'yellow.400' : 'transparent'}
// //               onClick={() => toggleFlag('daemon')}
// //             >
// //               <UserDaemonIcon width="2rem" />
// //             </Button>

// //           </HStack>

// //         </Box>
// //       )}

// //       {searchValue &&
// //         <Box cursor={'pointer'} onClick={() => setSearchValue('')}>
// //           <CircularCrossFillIcon color={'red'} width={'1rem'} />
// //         </Box>
// //       }
// //     </HStack>
// //   );

// //   return (
// //     <Grid templateColumns="repeat(2, 1fr)" gap={6} px={'2rem'} dir={giveDir()}>
// //       <GridItem colStart={1} colEnd={2}>
// //         <Text fontWeight={'800'} fontSize={'22px'} cursor={'default'}>{title}</Text>
// //         <Text fontWeight={'400'} fontSize={'15px'} cursor={'default'}>{description}</Text>
// //       </GridItem>

// //       <GridItem colStart={2} colEnd={3} dir={giveDir(true)} mt={'auto'}>
// //         <HStack spacing={2}>
// //           {hasAddButton &&
// //             <Tooltip bg={'black'}
// //                      color={'white'}
// //                      disabled={!addTitleDisabled}
// //                      content={addTitleDisabled ? giveText(159) : ''}
// //                      fontWeight={'bold'}>
// //               <Button borderRadius={5} px={4}
// //                       disabled={addTitleDisabled}
// //                       color={colorMode === 'light' ? 'white' : 'black'}
// //                       backgroundColor={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
// //                       _hover={{ backgroundColor: colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR }}
// //                       onClick={onOpenAdd}>
// //                 {addTitle}
// //               </Button>
// //             </Tooltip>
// //           }

// //           <UserFloatingLabelInput label={giveText(10)}
// //                               value={searchValue}
// //                               dir={giveDir()}
// //                               maxW={'400px'}
// //                               minW={'400px'}
// //                               hasInputLeftElement={true}
// //                               InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
// //                               hasInputRightElement={true}
// //                               InputRightElement={InputRightElement}
// //                               mx={3}
// //                               onChange={(e) => setSearchValue(e.target.value)}

// //                               />


// //           {extension}
// //         </HStack>
// //       </GridItem>
// //     </Grid>
// //   );
// // });





// // // import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
// // // import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../Base/BaseColor';
// // // import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
// // // import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
// // // import { useColorMode } from '../../ui/color-mode.jsx';
// // // import { Tooltip } from '../../ui/tooltip.jsx';
// // // import { SearchIcon } from '../../Base/CustomIcons/SearchIcon.jsx';
// // // import { memo } from 'react';
// // // import { CircularCrossFillIcon } from '../../Base/CustomIcons/CircularCrossFillIcon.jsx';

// // // export const ProBaseHeaderPage = memo(function ProBaseHeaderPage({
// // //                                                              title,
// // //                                                              description,
// // //                                                              onOpenAdd, addTitle = giveText(9),
// // //                                                              hasAddButton = true,
// // //                                                              searchValue,
// // //                                                              setSearchValue,
// // //                                                              extension,
// // //                                                              addTitleDisabled = false,
// // //                                                              InputRightElement,
// // //                                                              controller,
// // //                                                            }) {
// // //   const { colorMode } = useColorMode();

// // //   return (
// // //     <Grid templateColumns="repeat(2, 1fr)" gap={6} px={'2rem'} dir={giveDir()}>
// // //       <GridItem colStart={1} colEnd={2}>
// // //         <Text fontWeight={'800'} fontSize={'22px'} cursor={'default'}>{title}</Text>
// // //         <Text fontWeight={'400'} fontSize={'15px'} cursor={'default'}>{description}</Text>
// // //       </GridItem>

// // //       <GridItem colStart={2} colEnd={3} dir={giveDir(true)} mt={'auto'}>
// // //         <HStack spacing={2}>
// // //           {hasAddButton &&
// // //             <Tooltip bg={'black'}
// // //                      color={'white'}
// // //                      disabled={!addTitleDisabled}
// // //                      content={addTitleDisabled ? giveText(159) : ''}
// // //                      fontWeight={'bold'}>
// // //               <Button borderRadius={5} px={4}
// // //                       disabled={addTitleDisabled}
// // //                       color={colorMode === 'light' ? 'white' : 'black'}
// // //                       backgroundColor={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
// // //                       _hover={{ backgroundColor: colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR }}
// // //                       onClick={onOpenAdd}>
// // //                 {addTitle}
// // //               </Button>
// // //             </Tooltip>
// // //           }

// // //           <FloatingLabelInput label={giveText(10)}
// // //                               value={searchValue}
// // //                               dir={giveDir()}
// // //                               maxW={'400px'}
// // //                               minW={'400px'}
// // //                               hasInputLeftElement={true}
// // //                               InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
// // //                               hasInputRightElement={true}
// // //                               InputRightElement={(
// // //                                 <HStack mx={2}>
// // //                                   {InputRightElement}

// // //                                   {searchValue &&
// // //                                     <Box cursor={'pointer'} onClick={() => setSearchValue('')}>
// // //                                       <CircularCrossFillIcon color={'red'} width={'1rem'} />
// // //                                     </Box>
// // //                                   }
// // //                                 </HStack>
// // //                               )}
// // //                               mx={3}
// // //                               // onChange={(e) => {
// // //                               //   controller.abort();
// // //                               //   setSearchValue(e.target.value);
// // //                               // }}
// // //                               onChange={(e) => setSearchValue(e.target.value)}

// // //                               />


// // //           {extension}
// // //         </HStack>
// // //       </GridItem>
// // //     </Grid>
// // //   );
// // // });
