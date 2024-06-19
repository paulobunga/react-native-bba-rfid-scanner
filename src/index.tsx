import { NativeModules, NativeEventEmitter } from 'react-native';

type AddListener = (cb: (args: any[]) => void) => void;

const { C72RFIDScannerModule, AX6737RFIDScannerModule } = NativeModules;

const axEventEmitter = new NativeEventEmitter(AX6737RFIDScannerModule);

const axPowerListener: AddListener = (listener: any) =>
  axEventEmitter.addListener('UHF_POWER', listener);

const axTagListener: AddListener = (listener: any) =>
  axEventEmitter.addListener('UHF_TAG', listener);

export const AX6737RFIDScanner = {
  powerListener: axPowerListener,
  tagListener: axTagListener,
  initialize: () => AX6737RFIDScannerModule.initializeDevice(),
  startReadingTags: (callback: (args: any[]) => any) =>
    AX6737RFIDScannerModule.startReadingTags(callback),
  stopReadingTags: (callback: (args: any[]) => any) =>
    AX6737RFIDScannerModule.stopReadingTags(callback),
  readSingleTag: () => AX6737RFIDScannerModule.readSingleTag(),
  clearTags: () => AX6737RFIDScannerModule.clearTags(),
};

export const C72RFIDScanner = {
  initialize: C72RFIDScannerModule.initializeReader(),
};
