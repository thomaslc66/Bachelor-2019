package com.heig.vd.ch.estimote;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.estimote.coresdk.cloud.model.Color;
import com.estimote.coresdk.common.config.EstimoteSDK;
import com.estimote.coresdk.common.requirements.SystemRequirementsChecker;
import com.heig.vd.ch.estimote.utils.BeaconID;
import com.heig.vd.ch.estimote.utils.EstimoteCloudBeaconDetails;
import com.heig.vd.ch.estimote.utils.EstimoteCloudBeaconDetailsFactory;
import com.heig.vd.ch.estimote.utils.ProximityContentManager;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";
    private final String appId = "bachelor-thomas-estimote-d45";
    private final String appToken = "24e7dc3e8352ef52034171cfccd58128";


    private static final Map<Color, Integer> BACKGROUND_COLORS = new HashMap<>();

    static {
        BACKGROUND_COLORS.put(Color.ICY_MARSHMALLOW, android.graphics.Color.rgb(109, 170, 199));
        BACKGROUND_COLORS.put(Color.BLUEBERRY_PIE, android.graphics.Color.rgb(98, 84, 158));
        BACKGROUND_COLORS.put(Color.MINT_COCKTAIL, android.graphics.Color.rgb(155, 186, 160));
    }

    private static final int BACKGROUND_COLOR_NEUTRAL = android.graphics.Color.rgb(160, 169, 172);

    private ProximityContentManager proximityContentManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        EstimoteSDK.initialize(getApplicationContext(), appId, appToken);


        proximityContentManager = new ProximityContentManager(this,
                Arrays.asList(
                        new BeaconID("12C1544E-B3CA-FE3A-944F-6451D37CA0C0",200,200),
                        //new BeaconID("CE8DD4C5-2D14-B2A9-E143-5A204375707A",300,300),
                        new BeaconID("2FF20665-D658-F092-85B3-A7198F6FC786",600,600)
                        //new BeaconID("785C5EEC-0D94-73BD-4D8A-44A8F680E187",800,800)
                ),               new EstimoteCloudBeaconDetailsFactory());



        proximityContentManager.setListener(new ProximityContentManager.Listener() {
            @Override
            public void onContentChanged(Object content) {
                String text;
                Integer backgroundColor;
                if (content != null) {
                    EstimoteCloudBeaconDetails beaconDetails = (EstimoteCloudBeaconDetails) content;
                    text = "You're in " + beaconDetails.getBeaconName() + "'s range!";
                    backgroundColor = BACKGROUND_COLORS.get(beaconDetails.getBeaconColor());
                } else {
                    text = "No beacons in range.";
                    backgroundColor = null;
                }
                ((TextView) findViewById(R.id.textView)).setText(text);
                findViewById(R.id.relativeLayout).setBackgroundColor(
                        backgroundColor != null ? backgroundColor : BACKGROUND_COLOR_NEUTRAL);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (!SystemRequirementsChecker.checkWithDefaultDialogs(this)) {
            Log.e(TAG, "Can't scan for beacons, some pre-conditions were not met");
            Log.e(TAG, "Read more about what's required at: http://estimote.github.io/Android-SDK/JavaDocs/com/estimote/sdk/SystemRequirementsChecker.html");
            Log.e(TAG, "If this is fixable, you should see a popup on the app's screen right now, asking to enable what's necessary");
        } else {
            Log.d(TAG, "Starting ProximityContentManager content updates");
            proximityContentManager.startContentUpdates();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "Stopping ProximityContentManager content updates");
        proximityContentManager.stopContentUpdates();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        proximityContentManager.destroy();
    }
}
