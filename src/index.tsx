import { NativeModules } from 'react-native';

const { C72RFIDScannerModule, AX6737RFIDScannerModule } = NativeModules;

export const AX6737RFIDScanner = {
  initialize: AX6737RFIDScannerModule.initializeDevice,
};

export const C72RFIDScanner = {
  initialize: C72RFIDScannerModule.initializeReader,
};
