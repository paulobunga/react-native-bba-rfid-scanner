import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-bba-rfid-scanner' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const { C72RFIDScannerModule, AX6737RFIDScannerModule } = NativeModules;

if (!C72RFIDScannerModule || !AX6737RFIDScannerModule) {
  throw new Error(LINKING_ERROR);
}

type InitializeReader = () => void;
type DeinitializeReader = () => void;
type ReadSingleTag = () => Promise<any>;
type ReadPower = () => Promise<any>;
type ChangePower = (powerValue: any) => Promise<any>;
type AddListener = (cb: (args: any[]) => void) => void;
type ClearTags = () => void;

type StartReadingTags = () => void;
type StopReadingTags = () => void;
type PowerListener = (cb: (power: number) => void) => void;
type TagListener = (cb: (tag: string) => void) => void;

export const C72RFIDScanner = {
  initializeReader: C72RFIDScannerModule.initializeReader as InitializeReader,
  deInitializeReader:
    C72RFIDScannerModule.deInitializeReader as DeinitializeReader,
  readSingleTag: C72RFIDScannerModule.readSingleTag as ReadSingleTag,
  readPower: C72RFIDScannerModule.readPower as ReadPower,
  changePower: C72RFIDScannerModule.changePower as ChangePower,
  addListener: C72RFIDScannerModule.addListener as AddListener,
  clearTags: C72RFIDScannerModule.clearTags as ClearTags,
  startReadingTags: C72RFIDScannerModule.startReadingTags as StartReadingTags,
  stopReadingTags: C72RFIDScannerModule.stopReadingTags as StopReadingTags,
  powerListener: C72RFIDScannerModule.powerListener as PowerListener,
  tagListener: C72RFIDScannerModule.tagListener as TagListener,
};

export const AX6737RFIDScanner = {
  initializeReader:
    AX6737RFIDScannerModule.initializeReader as InitializeReader,
  deInitializeReader:
    AX6737RFIDScannerModule.deInitializeReader as DeinitializeReader,
  readSingleTag: AX6737RFIDScannerModule.readSingleTag as ReadSingleTag,
  readPower: AX6737RFIDScannerModule.readPower as ReadPower,
  changePower: AX6737RFIDScannerModule.changePower as ChangePower,
  addListener: AX6737RFIDScannerModule.addListener as AddListener,
  clearTags: AX6737RFIDScannerModule.clearTags as ClearTags,
  startReadingTags:
    AX6737RFIDScannerModule.startReadingTags as StartReadingTags,
  stopReadingTags: AX6737RFIDScannerModule.stopReadingTags as StopReadingTags,
  powerListener: AX6737RFIDScannerModule.powerListener as PowerListener,
  tagListener: AX6737RFIDScannerModule.tagListener as TagListener,
};
