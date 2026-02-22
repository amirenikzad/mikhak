export const hasPageNameMatch = (items, pageName) => {
  return items.some(item =>
    item.section === pageName ||
    (item.items && hasPageNameMatch(item.items, pageName)),
  );
};

export const lightenColor = (rgb, amount) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const coefficient = 70;
  return `rgb(${Math.min(r + amount * coefficient, 255)}, ${Math.min(g + amount * coefficient, 255)}, ${Math.min(b + amount * coefficient, 255)})`;
};
