import { NativeModules, NativeEventEmitter } from 'react-native';

const { C72RFIDScannerModule, AX6737RFIDScannerModule } = NativeModules;

const axEventEmitter = new NativeEventEmitter(AX6737RFIDScannerModule);

const axPowerListener = (listener: any) =>
  axEventEmitter.addListener('UHF_POWER', listener);

const axTagListener = (listener: any) =>
  axEventEmitter.addListener('UHF_TAG', listener);

export const AX6737RFIDScanner = {
  powerListener: axPowerListener,
  tagListener: axTagListener,
  initialize: AX6737RFIDScannerModule.initializeDevice,
  startReadingTags: AX6737RFIDScannerModule.startReadingTags,
  stopReadingTags: AX6737RFIDScannerModule.stopReadingTags,
  readSingleTag: AX6737RFIDScannerModule.readSingleTag,
  clearTags: AX6737RFIDScannerModule.clearTags,
};

export const C72RFIDScanner = {
  initialize: C72RFIDScannerModule.initializeReader,
};
