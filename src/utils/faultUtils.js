export const HV_VOLTAGE_OPTIONS = [
  {value: '500', label: '500'},
  {value: '330', label: '330'},
  {value: '275', label: '275'},
  {value: '220', label: '220'},
  {value: '132', label: '132'},
  {value: '66', label: '66'},
  {value: '33', label: '33'},
  {value: '11', label: '11'},
];

export const LV_VOLTAGE_OPTIONS = [
  {value: '132', label: '132'},
  {value: '66', label: '66'},
  {value: '33', label: '33'},
  {value: '11', label: '11'},
  {value: '0.77', label: '0.770'},
  {value: '0.69', label: '0.690'},
  {value: '0.66', label: '0.660'},
  {value: '0.415', label: '0.415'},
  {value: '0.4', label: '0.400'},
];

export const C_FACTOR_OPTIONS = [
  {value: '0.9', label: '0.9'},
  {value: '0.95', label: '0.95'},
  {value: '1.0', label: '1.0'},
  {value: '1.1', label: '1.1'},
];

export const DEFAULT_VALUES = {
  gridKA: '50',
  hvKV: '330',
  lvKV: '33',
  txMVA: '150',
  txZ: '15',
  cFactor: '1.1',
};

export function calculateFaultLevel(
    gridKA, hvKV, lvKV, txMVA, txZ, cFactor = 1.1) {
  const Sbase = 100e6;

  const I_HVbase = Sbase / (Math.sqrt(3) * hvKV * 1e3);
  const If_PU = (gridKA * 1e3) / I_HVbase;
  const Z_grid_pu = cFactor / If_PU;

  const I_LVbase = Sbase / (Math.sqrt(3) * lvKV * 1e3);
  const Z_TX_pu = (txZ * 0.01 / txMVA) * 100;
  const Ztot_pu = Z_TX_pu + Z_grid_pu;
  const If_pu = cFactor / Ztot_pu;
  const IF_max = Math.round((If_pu * I_LVbase / 1e3) * 100) / 100;

  return {
    I_HVbase,
    If_PU,
    Z_grid_pu,
    I_LVbase,
    Z_TX_pu,
    Ztot_pu,
    If_pu,
    IF_max,
    cFactor,
  };
}

export function validateInputs(values) {
  const parsed = {
    gridKA: Number(values.gridKA),
    hvKV: Number(values.hvKV),
    lvKV: Number(values.lvKV),
    txMVA: Number(values.txMVA),
    txZ: Number(values.txZ),
    cFactor: Number(values.cFactor),
  };

  const valid = Object.values(parsed).every((v) => Number.isFinite(v) && v > 0);

  if (!valid) {
    return {
      valid: false,
      message: 'Please enter valid positive values for all parameters.',
      parsed,
    };
  }

  if (parsed.lvKV >= parsed.hvKV) {
    return {
      valid: false,
      message: 'LV bus voltage should be lower than HV bus voltage.',
      parsed,
    };
  }

  return {valid: true, message: '', parsed};
}