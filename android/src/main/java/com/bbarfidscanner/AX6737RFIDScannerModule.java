package com.bbarfidscanner;

import android.content.IntentFilter;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.handheld.uhfr.UHFRManager;
import com.uhf.api.cls.Reader;

import java.util.ArrayList;
import java.util.Arrays;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import android.view.KeyEvent;

import androidx.annotation.NonNull;

import com.BRMicro.Tools;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.handheld.uhfr.UHFRManager;
import com.uhf.api.cls.Reader;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

@ReactModule(name = AX6737RFIDScannerModule.NAME)
public class AX6737RFIDScannerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  public static final String NAME = "AX6737RFIDScannerModule";

  private static final String UHF_READER_READ_ERROR = "UHF_READER_READ_ERROR";
  private static final int MAX_SINGLE_SCAN_RETRIES = 50;

  private final ReactApplicationContext reactContext;
  private static UHFRManager uhfrManager;
  private boolean isMulti = false;
  private int allCount = 0;
  private long startTime = 0;
  private boolean keyUpFlag = true;

  private boolean keyControl = true;
  private boolean isRunning = false;
  private boolean isStart = false;
  private String epc;

  private boolean isSoftPaused = false;

  private List<String> scannedTags = new ArrayList<String>();

  public AX6737RFIDScannerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    IntentFilter filter = new IntentFilter();
    filter.addAction("android.rfid.FUN_KEY");
    this.reactContext.registerReceiver(receiver, filter);
    this.reactContext.addLifecycleEventListener(this);
  }


  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void initializeReader() {
    this.uhfrManager = UHFRManager.getInstance();
  }

  @ReactMethod
  public void deInitializeReader() {
    if(this.uhfrManager != null) {
      this.uhfrManager.close();
    }
  }

  @ReactMethod
  public void clearTags() {
    scannedTags.clear();
  }

  private List<String> extractTagData(Reader.TAGINFO tfs) {
    byte[] epcdata = tfs.EpcId;
    epc = Tools.Bytes2HexString(epcdata, epcdata.length);
    int rssi = tfs.RSSI;
    Log.d("ISSH", epc);
    epc = Tools.Bytes2HexString(epcdata, epcdata.length);
    return Arrays.asList(epc, String.valueOf(rssi));
  }

  @ReactMethod
  // public void startReadingTags() {
  public void startReadingTags(final Callback callback) {
    if (!isStart) {
      uhfrManager.setCancleInventoryFilter();
      isRunning = true;
      if (isMulti) {
        uhfrManager.setFastMode();
        uhfrManager.asyncStartReading();
      } else {
        uhfrManager.setCancleFastMode();
      }
      new Thread(inventoryTask).start();
      callback.invoke(isStart = true);
    }
  }

  @ReactMethod
  // public void stopReadingTags() {
  public void stopReadingTags(final Callback callback) {
    if (isMulti) {
      uhfrManager.asyncStopReading();
    } else {
      uhfrManager.stopTagInventory();
    }

    try {
      Thread.sleep(100);
    } catch (Exception e) {
      e.printStackTrace();
    }

    isRunning = false;
    isStart = false;
    callback.invoke(scannedTags.size());
  }

  /*
   * This function is a hack for triggering a Single Scan.
   *
   * A Much better solution would be to synchronize with the invetoryTask thread
   * to avoid race conditions and competition for the scanning resource, that is
   * uhfrManager.
   *
   * TODO: uhfrManager.tagInventoryByTimer((short) 50) always crashes the
   * application when isMulti == true.
   *
   * TODO: Find a way of making singleScan mode work without retries. For now it
   * works under a minimun of 2 retries and observed maximum of about 5 - 7
   * retries
   */
  @ReactMethod
  public void readSingleTag(Promise promise) {
    this.isSoftPaused = true;

    if (isStart) {

      boolean hasScannedTag = false;
      int tries = 0;
      List<Reader.TAGINFO> list1 = null;

      while (!hasScannedTag && tries < MAX_SINGLE_SCAN_RETRIES) {
        if (isMulti) {
          list1 = uhfrManager.tagInventoryRealTime();
        } else {
          list1 = uhfrManager.tagInventoryByTimer((short) 50);
        }
        tries++;
        if (list1 != null && list1.size() > 0) {
          hasScannedTag = true;
        }
      }

      if (hasScannedTag) {
        Reader.TAGINFO tfs = list1.get(0);
        // TODO: Consider using a map to store tagData
        List<String> tagData = extractTagData(tfs);
        promise.resolve(convertArrayToWritableArray((String[]) tagData.toArray()));
      } else {
        promise.reject(UHF_READER_READ_ERROR, "READ FAILED");
      }
    }

    this.isSoftPaused = false;
  }

  private void sendEvent(String eventName, WritableArray array) {
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,
      array);
  }

  private void sendEvent(String eventName, String status) {
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,
      status);
  }

  public static WritableArray convertArrayToWritableArray(String[] tag) {
    WritableArray array = new WritableNativeArray();
    for (String tagId : tag) {
      array.pushString(tagId);
    }
    return array;
  }

  private Runnable inventoryTask = new Runnable() {
    @Override
    public void run() {
      while (isRunning) {
        if (isStart && !isSoftPaused) {
          List<Reader.TAGINFO> list1;
          if (isMulti) {
            list1 = uhfrManager.tagInventoryRealTime();
          } else {
            list1 = uhfrManager.tagInventoryByTimer((short) 50);
          }

          if (list1 != null && list1.size() > 0) {
            for (Reader.TAGINFO tfs : list1) {
              List<String> tagData = extractTagData(tfs);
              // TODO: Consider using a map to store tagData
              if (!scannedTags.contains(tagData.get(0))) {
                scannedTags.add(tagData.get(0));
                sendEvent("UHF_TAG", AX6737RFIDScannerModule
                  .convertArrayToWritableArray((String[]) tagData.toArray()));
              }
            }
          }
        }
      }
    }
  };

  private void runInventory() {
    // Log.d("ISSH", "Run Inventory");
    // Toast.makeText(reactContext, "Run Inventory", Toast.LENGTH_SHORT).show();
    if (keyControl) {
      keyControl = false;
      if (!isStart) {
        uhfrManager.setCancleInventoryFilter();
        isRunning = true;
        if (isMulti) {
          uhfrManager.setFastMode();
          uhfrManager.asyncStartReading();
        } else {
          uhfrManager.setCancleFastMode();
        }
        new Thread(inventoryTask).start();
        isStart = true;
      } else {
        if (isMulti) {
          uhfrManager.asyncStopReading();
        } else {
          uhfrManager.stopTagInventory();
        }

        try {
          Thread.sleep(100);
        } catch (Exception e) {
          e.printStackTrace();
        }

        isRunning = false;
        isStart = false;
      }

      keyControl = true;
    }
  }

  private BroadcastReceiver receiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      int keyCode = intent.getIntExtra("keyCode", 0);
      if (keyCode == 0) {// H941
        keyCode = intent.getIntExtra("keycode", 0);
      }
      boolean keyDown = intent.getBooleanExtra("keydown", false);

      if (keyUpFlag && keyDown && System.currentTimeMillis() - startTime > 0) {
        keyUpFlag = false;
        startTime = System.currentTimeMillis();
        if ((keyCode == KeyEvent.KEYCODE_F1 || keyCode == KeyEvent.KEYCODE_F2 || keyCode == KeyEvent.KEYCODE_F3
          || keyCode == KeyEvent.KEYCODE_F4 || keyCode == KeyEvent.KEYCODE_F5)) {
          runInventory();
        }
        return;
      } else if (keyDown) {
        startTime = System.currentTimeMillis();
      } else {
        keyUpFlag = true;
      }
    }
  };

  @Override
  public void onHostResume() {
    if (uhfrManager != null) {
      uhfrManager.setPower(33, 33);
      uhfrManager.setRegion(Reader.Region_Conf.RG_EU3);
      // Log.d("ISSSH", "THIS IS WORKING");
      sendEvent("UHF_POWER", "SUCCESS:POWER_ON");
    }
  }

  @Override
  public void onHostPause() {
    if (isStart) {
      runInventory();
    }
  }

  @Override
  public void onHostDestroy() {
    reactContext.unregisterReceiver(receiver);
    if (uhfrManager != null) {
      uhfrManager.close();
      uhfrManager = null;
    }
  }

  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }
}
