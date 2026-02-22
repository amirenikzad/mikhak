import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableRow, TableCell } from '@mui/material';
import { Center, HStack } from '@chakra-ui/react';
import { TableText } from '../../../Base/Extensions.jsx';
import { DELETE_PANEL, PUT_PANEL } from '../../../Base/UserAccessNames.jsx';
import { EditIcon, RemoveIcon } from '../../../Base/IconsFeatures/Icons.jsx';
import { memo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Switch } from '../../../ui/switch.jsx';
import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';

const PanelTable = memo(function PanelRow({
  row,
  ids,
  onChangeCheckbox,
  hasAccessCheckbox,
}) {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(Boolean(row.panel_obj_value));
  const [localChecked, setLocalChecked] = useState(row.panel_obj_value);
  
  const onToggle = async () => {
    const newValue = !isChecked;
    setIsChecked(newValue); // آپدیت UI سریع

    try {
        await fetchWithAxios({
        url: '/panel_settings',
        method: 'PUT',
        data: {
            id: row.id,
            value: newValue,
        },
        });

        row.panel_obj_value = newValue;
    } catch (err) {
        console.error(err);
        setIsChecked(!newValue); // revert اگر API خطا داد
    }
    };


  useEffect(() => {
    setIsChecked(Boolean(row.panel_obj_value));
  }, [row.panel_obj_value]);

  // console.log('row', row);
  // console.log('IsChecked', isChecked);

    // useEffect(() => {
    //     setLocalChecked(row.panel_obj_value);
    // }, [row.panel_obj_value]);

  // sync با API وقتی isChecked تغییر کنه
//   useEffect(() => {
//     const updatePanel = async () => {
//       try {
//         await fetchWithAxios({
//           url: '/panel_settings',
//           method: 'PUT',
//           data: {
//             id: row.id,
//             value: isChecked,
//           },
//         });
//       } catch (err) {
//         console.error(err);
//         setIsChecked(!isChecked); // revert اگر API خطا داد
//       }
//     };

//     updatePanel();
//   }, [isChecked, row.id]);

  return (
    <TableRow hover>
      {hasAccessCheckbox && (
        <TableCell>
          <Center>
            <Checkbox
              checked={ids.has(row?.id)}
              onChange={() => onChangeCheckbox(row.id)}
            />
          </Center>
        </TableCell>
      )}

      <TableCell align="center">
        <TableText text={row?.panel_obj_key} maxLength={25}/>
      </TableCell>

      <TableCell align="center">
        <Center>
          {/* <Switch
            inputProps={{
              type: 'checkbox',
              checked: isChecked,
              onChange: () => setIsChecked(prev => !prev), // فقط state آپدیت میشه
              disabled: !accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_PANEL),
            }}
          /> */}
          <Switch
            checked={isChecked}
            colorPalette={'cyan'}
            size={'sm'}
            inputProps={{
                // type: 'checkbox',
                // checked: isChecked,
                onChange: onToggle,
                // disabled: !accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_PANEL),
            }}
            disabled={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_PANEL)}
            />

        </Center>
      </TableCell>
    </TableRow>
  );
});


export default PanelTable;

// import { useDispatch, useSelector } from 'react-redux';
// import { TableRow, TableCell } from '@mui/material';
// import { Center, HStack } from '@chakra-ui/react';
// import { TableText } from '../../../Base/Extensions.jsx';
// import { DELETE_PANEL, PUT_PANEL } from '../../../Base/UserAccessNames.jsx';
// import { EditIcon, RemoveIcon } from '../../../Base/IconsFeatures/Icons.jsx';
// import { memo } from 'react';
// import Checkbox from '@mui/material/Checkbox';
// import { Switch } from '../../../ui/switch.jsx';


// const PanelTable = memo(function PanelRow({
//   row,
//   ids,
//   onChangeCheckbox,
//   hasAccessCheckbox,
// }) {
//   const accessSlice = useSelector(state => state.accessSlice);
//   const dispatch = useDispatch();

//   const onToggle = async () => {
//   try {
//     await fetchWithAxios({
//       url: '/panel_settings', // ← مسیر درست
//       method: 'PUT',
//       data: {
//         id: row.id,
//         value: !row.panel_obj_value, // ← مقدار جدید
//       },
//     });

//     // آپدیت محلی row بعد از موفقیت
//     row.panel_obj_value = !row.panel_obj_value;
//   } catch (err) {
//     console.error(err);
//   }
// };


//   console.log('row', row);


//   return (
//     <TableRow hover>
//       {hasAccessCheckbox && (
//         <TableCell>
//           <Center>
//             <Checkbox
//               checked={ids.has(row?.id)}
//               onChange={() => onChangeCheckbox(row.id)}
//             />
//           </Center>
//         </TableCell>
//       )}

//       {/* panel key */}
//       <TableCell align="center">
//         <TableText text={row?.panel_obj_key} maxLength={25}/>
//       </TableCell>

//       {/* switch */}
//       <TableCell align="center">
//         <Center>
//           {/* <Switch
//             // checked={Boolean(row?.panel_obj_value)}
//             // onChange={onToggle}
//             // color="success"
//             // disabled={
//             //   !accessSlice.isAdmin &&
//             //   !accessSlice.userAccess?.includes(PUT_PANEL)
//             // }
//             inputProps={{
//                 type: 'checkbox',
//                 checked: row?.panel_obj_value,
//                 onChange: onToggle,
//             }}
//             disabled={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_PANEL)}
//           /> */}
//           <Switch
//             inputProps={{
//               type: 'checkbox',
//               checked: isChecked,
//               onChange: onToggle,
//             }}
//             disabled={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_PANEL)}
//           />
//         </Center>
//       </TableCell>
//     </TableRow>
//   );
// });

// export default PanelTable;

// // import { TableRow, TableCell } from '@mui/material';
// // import { Center, HStack } from '@chakra-ui/react';
// // import { TableText } from '../../../Base/Extensions.jsx';
// // import { DELETE_PANEL, PUT_PANEL } from '../../../Base/UserAccessNames.jsx';
// // import { EditIcon, RemoveIcon } from '../../../Base/IconsFeatures/Icons.jsx';
// // import { useSelector } from 'react-redux';
// // import { memo } from 'react';
// // import Checkbox from '@mui/material/Checkbox';
// // import { Switch } from '../../../ui/switch.jsx';

// // const arePropsEqual = (prevProps, nextProps) => {
// //   if (prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id)
// //     && prevProps.row?.panel_name === nextProps.row?.panel_name
// //   ) {
// //     return true; // props are equal
// //   }
// //   return false; // props are not equal -> update the component
// // };

// // const PanelTable = memo(function PanelRow({
// //                                           row,
// //                                           ids,
// //                                           onChangeCheckbox,
// //                                           hasAccessCheckbox,
// //                                           setIsOpenEditPanel,
// //                                           setIsOpenRemove,
// //                                           setPanel,
// //                                         }) {
// //   const accessSlice = useSelector(state => state.accessSlice);

// //   return (
// //     <TableRow hover panel="checkbox" tabIndex={-1}>
// //       {hasAccessCheckbox &&
// //         <TableCell component="th" scope="row">
// //           <Center>
// //             <Checkbox sx={{ color: 'gray' }}
// //                       color="primary"
// //                       checked={ids.has(row?.id)}
// //                       onChange={() => onChangeCheckbox(row.id)}
// //                       inputProps={{ 'aria-labelledby': 'checkbox' }} />
// //           </Center>
// //         </TableCell>
// //       }

// //       <TableCell align={'center'} component="th" scope="row" sx={{ maxWidth: '100px', px: '200px' }}>
// //         <TableText text={row?.panel_name} maxLength={30} hasCenter={false} />
// //       </TableCell>

// //       {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PANEL) || accessSlice.userAccess?.includes(DELETE_PANEL)) &&
// //         <TableCell align={'center'} component="th" scope="row">
// //           <Center>
// //             <HStack spacing={2}>
// //               {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PANEL)) &&
// //                 <EditIcon onClick={() => {
// //                   setIsOpenEditPanel(true);
// //                   setPanel(row);
// //                 }} />
// //               }

// //               {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PANEL)) &&
// //                 <RemoveIcon onClick={() => {
// //                   setIsOpenRemove(true);
// //                   setPanel(row);
// //                 }} />
// //               }
// //             </HStack>
// //           </Center>
// //         </TableCell>
// //       }
// //     </TableRow>
// //   );
// // }, arePropsEqual);

// // export default PanelTable;
