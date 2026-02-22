import { EN_UN_NAME, FA_IR_NAME } from '../MultiLanguages/Languages/Names.jsx';
import { ListItem, Stack, Text, UnorderedList } from '@chakra-ui/react';

export const IMAGE_NAME = 'image';
export const VIDEO_NAME = 'video';

export const newOptionsData = () => [
  {
    title: {
      [EN_UN_NAME]: 'New Graph Theme',
      [FA_IR_NAME]: 'نمایش جدیدی از گراف',
    },
    data: [
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/graph_dark.mp4',
          light: '/assets/newOptions/graph_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'New Graph Theme',
          [FA_IR_NAME]: 'نمایش جدیدی از گراف',
        },
        description: {
          [EN_UN_NAME]: 'A new representation of the graph has been created.',
          [FA_IR_NAME]: 'نمایش جدیدی از گراف ایجاد شده است.',
        },
      },
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/graph_move_dark.mp4',
          light: '/assets/newOptions/graph_move_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'To move',
          [FA_IR_NAME]: 'حرکت دادن',
        },
        description: {
          [EN_UN_NAME]: 'You can easily move all elements. To do this, go to the element, drag and drop it👌',
          [FA_IR_NAME]: 'تمامی المان ها را می توانید به راحتی جابجا کنید. برای این کار به روی المان بروید، با موس کلیک کرده، نگه دارید و حرکت دهید.👌',
        },
      },
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/graph_control_dark.mp4',
          light: '/assets/newOptions/graph_control_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'Controls',
          [FA_IR_NAME]: 'کنترل‌ها',
        },
        description: {
          [EN_UN_NAME]: (
            <Stack>
              <Text fontSize={'16px'} fontWeight={'700'}>There are 4 controls at the bottom left:</Text>

              <UnorderedList>
                <ListItem>Zoom in</ListItem>
                <ListItem>Zoom out</ListItem>
                <ListItem>Fit to size</ListItem>
                <ListItem>Lock to prevent elements from moving</ListItem>
              </UnorderedList>
            </Stack>
          ),
          [FA_IR_NAME]: (
            <Stack>
              <Text fontSize={'16px'} fontWeight={'700'}>۴ کنترل در سمت چپ پایین قرار دارند:</Text>

              <UnorderedList>
                <ListItem>بزرگ نمایی</ListItem>
                <ListItem>کوچک کردن</ListItem>
                <ListItem>اندازه مناسب</ListItem>
                <ListItem>برای جلوگیری از جابجایی عناصر قفل کنید</ListItem>
              </UnorderedList>
            </Stack>
          ),
        },
      },
    ],
  },
  {
    title: {
      [EN_UN_NAME]: 'Organization',
      [FA_IR_NAME]: 'سازمان',
    },
    data: [
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/organization_add_dark.mp4',
          light: '/assets/newOptions/organization_add_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'Add New Organization',
          [FA_IR_NAME]: 'اضافه کردن سازمان جدید',
        },
        description: {
          [EN_UN_NAME]: 'Add a new organization by clicking New.',
          [FA_IR_NAME]: 'با کلیک بر روی جدید، سازمان جدید را اضافه کنید.',
        },
      },
      {
        type: IMAGE_NAME,
        address: {
          dark: '/assets/newOptions/organization_map_dark.png',
          light: '/assets/newOptions/organization_map_dark.png',
        },
        title: {
          [EN_UN_NAME]: 'See Map',
          [FA_IR_NAME]: 'دیدن نقشه',
        },
        description: {
          [EN_UN_NAME]: 'By clicking on the map icon in the organization table, you can see the organization\'s address on the map.',
          [FA_IR_NAME]: 'با کلیک بر روی آیکون نقشه در جدول سازمان، آدرس سازمان را روی نقشه ببینید.',
        },
      },
    ],
  },
  {
    title: {
      [EN_UN_NAME]: 'Wallet',
      [FA_IR_NAME]: 'کیف پول',
    },
    data: [
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/wallet_add_dark.mp4',
          light: '/assets/newOptions/wallet_add_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'Increase Balance',
          [FA_IR_NAME]: 'افزودن موجودی',
        },
        description: {
          [EN_UN_NAME]: 'Increase your account balance according to the image',
          [FA_IR_NAME]: 'موجودی حساب خود را با توجه به تصویر افزایش دهید.',
        },
      }
    ],
  },
  {
    title: {
      [EN_UN_NAME]: 'Users Wallet',
      [FA_IR_NAME]: 'کیف پول کاربران',
    },
    data: [
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/users_wallet_add_dark.mp4',
          light: '/assets/newOptions/users_wallet_add_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'Increasing users\' wallet balance',
          [FA_IR_NAME]: 'افزایش موجودی کیف پول کاربران',
        },
        description: {
          [EN_UN_NAME]: 'Increase users\' wallet balance as shown in the image',
          [FA_IR_NAME]: 'افزایش موجودی کیف پول کاربران مطابق تصویر',
        },
      },
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/users_wallet_suspend_dark.mp4',
          light: '/assets/newOptions/users_wallet_suspend_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'Suspend users\' wallet',
          [FA_IR_NAME]: 'تعلیق کیف پول کاربران',
        },
        description: {
          [EN_UN_NAME]: 'Suspend users\' wallet as shown in the image',
          [FA_IR_NAME]: 'تعلیق کیف پول کاربران مطابق تصویر',
        },
      },
      {
        type: VIDEO_NAME,
        address: {
          dark: '/assets/newOptions/multiple_users_wallet_add_dark.mp4',
          light: '/assets/newOptions/multiple_users_wallet_add_light.mp4',
        },
        title: {
          [EN_UN_NAME]: 'Suspend users\' wallet',
          [FA_IR_NAME]: 'تعلیق کیف پول کاربران',
        },
        description: {
          [EN_UN_NAME]: 'Suspend users\' wallet as shown in the image',
          [FA_IR_NAME]: 'تعلیق کیف پول کاربران مطابق تصویر',
        },
      }
    ],
  },
];
