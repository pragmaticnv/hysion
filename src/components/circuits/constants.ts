export const BREADBOARD_CONFIG = {
  columns: 30,
  rows: 10,
  spacing: 0.5,
  ravineWidth: 0.2,
};

export const getPinPosition = (pinId: string): [number, number, number] => {
  const { columns, rows, spacing, ravineWidth } = BREADBOARD_CONFIG;
  
  // Power rail logic
  if (pinId.startsWith('VCC_T')) return [(parseInt(pinId.split('_')[2]) - columns / 2) * spacing, 0.05, -3.5];
  if (pinId.startsWith('GND_T')) return [(parseInt(pinId.split('_')[2]) - columns / 2) * spacing, 0.05, -3.2];
  if (pinId.startsWith('VCC_B')) return [(parseInt(pinId.split('_')[2]) - columns / 2) * spacing, 0.05, 3.2];
  if (pinId.startsWith('GND_B')) return [(parseInt(pinId.split('_')[2]) - columns / 2) * spacing, 0.05, 3.5];

  // Standard pin logic (e.g., A1, F30)
  const rowChar = pinId[0];
  const colNum = parseInt(pinId.substring(1)) - 1;
  const rowIndex = rowChar.charCodeAt(0) - 65;

  const x = (colNum - columns / 2) * spacing;
  const z = (rowIndex - rows / 2) * spacing + (rowIndex >= 5 ? ravineWidth : -ravineWidth);
  
  return [x, 0.05, z];
};
