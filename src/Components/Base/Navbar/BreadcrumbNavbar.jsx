import { memo, useMemo } from 'react';
import { Breadcrumb, HStack } from '@chakra-ui/react';
import { ADMIN_ROUTE, DASHBOARD_ROUTE } from '../BaseRouts.jsx';
import { giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { useSelector } from 'react-redux';

export const BreadcrumbNavbar = memo(function BreadcrumbNavbar() {
  const baseSlice = useSelector(state => state.baseSlice);
  const breadcrumbFontSize = useMemo(() => '13px', []);
  const breadcrumbColor = useMemo(() => 'gray.400', []);

  return (
    <Breadcrumb.Root variant={'underline'}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link fontSize={breadcrumbFontSize}
                           color={breadcrumbColor}
                           href={`${ADMIN_ROUTE}${DASHBOARD_ROUTE}`}>
            {giveText(91)}
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator color={breadcrumbColor} />

        {baseSlice?.breadcrumbAddress?.map((breadcrumb, index, array) => {
          switch (breadcrumb.type) {
            case 'navigate':
              return (
                <HStack key={index}>
                  <Breadcrumb.Item>
                    <Breadcrumb.CurrentLink fontSize={breadcrumbFontSize}
                                            textDecoration={'underline'}
                                            cursor={'pointer'}
                                            color={breadcrumbColor}
                                            onClick={() => navigate(breadcrumb.navigate)}>
                      {breadcrumb.text}
                    </Breadcrumb.CurrentLink>
                  </Breadcrumb.Item>
                  {(array.length !== index + 1) && <Breadcrumb.Separator color={breadcrumbColor} />}
                </HStack>
              );
            case 'link':
              return (
                <HStack key={index}>
                  <Breadcrumb.Item>
                    <Breadcrumb.Link fontSize={breadcrumbFontSize}
                                     color={breadcrumbColor}
                                     href={breadcrumb.link}>
                      {breadcrumb.text}
                    </Breadcrumb.Link>
                  </Breadcrumb.Item>
                  {(array.length !== index + 1) && <Breadcrumb.Separator color={breadcrumbColor} />}
                </HStack>
              );
            case 'text':
              return (
                <HStack key={index}>
                  <Breadcrumb.Item>
                    <Breadcrumb.CurrentLink fontSize={breadcrumbFontSize}
                                            color={breadcrumbColor}
                                            cursor={'default'}>
                      {breadcrumb.text}
                    </Breadcrumb.CurrentLink>
                  </Breadcrumb.Item>
                  {(array.length !== index + 1) && <Breadcrumb.Separator color={breadcrumbColor} />}
                </HStack>
              );
          }
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
});
