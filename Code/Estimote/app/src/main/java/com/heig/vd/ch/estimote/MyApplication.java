package com.heig.vd.ch.estimote;

import android.app.Application;

import com.estimote.coresdk.common.config.EstimoteSDK;


//
// Running into any issues? Drop us an email to: contact@estimote.com
//

public class MyApplication extends Application {

    private final String appId = "bachelor-thomas-estimote-d45";
    private final String appToken = "24e7dc3e8352ef52034171cfccd58128";

    @Override
    public void onCreate() {
        super.onCreate();

        // TODO: put your App ID and App Token here
        // You can get them by adding your app on https://cloud.estimote.com/#/apps
        EstimoteSDK.initialize(getApplicationContext(), appId, appToken);

        // uncomment to enable debug-level logging
        // it's usually only a good idea when troubleshooting issues with the Estimote SDK
//        EstimoteSDK.enableDebugLogging(true);
    }
}