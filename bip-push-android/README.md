Sample: bluelist-push-android
===

The bluelist-push-android sample builds upon the bluelist-mobiledata-android sample to add notifications from the Push service with Cloud Code.

This sample works with the Mobile Cloud, an application boilerplate that is available on [IBM Bluemix](https://www.ng.bluemix.net).  With this boilerplate, you can quickly incorporate pre-built, managed, and scalable cloud services into your mobile applications without relying on IT involvement. You can focus on building your mobile applications rather than the complexities of managing the back end infrastructure.

After you run the sample and add some items to the list, you can see your data is synchronized between multiple devices.  You can also send push notifications to your devices from the Push service in the Bluemix dashboard.

Creating the Mobile Cloud boilerplate application
---
1. Login to [IBM Bluemix](https://www.bluemix.net)
2. Click 'Catalog' or 'Create An App'
3. Under Boilerplates, select Mobile Cloud.
4. Enter in App Info & select 'Create'
5. You now have a mobile cloud backend, providing you with some mobile services on the cloud!

Downloading this sample
---

You can clone the samples from IBM DevOps Services with the following command:

    git clone https://hub.jazz.net/git/mobilecloud/bluelist-push

The bluelist-push-android sample will be located within the bluelist-push directory you just created.

The bluelist-push-node code is the Node.js runtime code used with the bluelist-push-android sample.

Running this sample
---

See the instructions in [Extend an Android app using the Push cloud service](http://www.ibm.com/developerworks/library/mo-android-push-app/index.html) for more information about how to import this sample into your Android development environment, configure Push and Node.js, and run the sample in a mobile emulator.

Alternatively, follow the instructions below:

Before You Start: Get your Google API Project Number and GCM API Key
---

1. Open the [Google Developers Console](https://cloud.google.com/console/project).
2. Click CREATE PROJECT, enter a Project name, click Create.
3. Copy the Project Number from the top of the page. This is your GCM Sender Id (Google API Project Number). You'll need this later!
4. Click APIs & auth on the left of the page.
5. Turn ON Google Cloud Messaging for Android.
6. Under APIs & auth, click Credentials.
7. Click CREATE NEW KEY under the Public API access section.
8. Click Server key.
9. Click Create.
10. Copy the API key from the Public API access section. This is your Sender Auth Token (GCM API Key). You'll need this later!

Dependency Management in Android Studio
---

First you will need to download the Gradle .zip file from [here](http://www.gradle.org). To install Gradle, simply extract the downloaded zip into the directory of your choice.

Android Studio will ask for a GRADLE HOME when importing the sample. Set that path to the directory extracted from the Gradle .zip file where the 'bin' directory lives. The 'build.gradle' file will automatically build your project, pulling in the required dependencies. You can then skip down to "Properties Configuration".

Otherwise, if using Eclipse etc, on [IBM Bluemix](https://www.bluemix.net) click on your newly created app, then click Download SDKs, and click the Android SDK.
Once downloaded, unzip the SDK, and copy the required jars (ibmbluemix.jar, ibmdata.jar, ibmcloudcode.jar, ibmpush.jar, and ibmfilesync.jar) into the 'libs' folder of your project. Then follow the directions in order below.

Add Google Play Services to Your Project
---

1. Open Eclipse, and select Window > Android SDK Manager.
2. Scroll to the bottom, and select Google Play services under Extras.
3. Click Install 1 package... and accept the licenses.
4. After the installation is successful, import the project now located in your file system at <Android_SDK_Location>\extras\google\google_play_services\libproject\google-play-services_lib into your Eclipse workspace. To do this, select File > Import, and then select Android > Existing Android Code into Workspace, and browse to the google-play-services_lib project.
5. After successfully importing google-play-services_lib into your workspace, it needs to be marked as an Android library project. To do this, open the Properties for the project and make sure the Is Library checkbox is checked.
6. Next, your project needs to refer to the new library project. To add the reference to the google-play-services_lib Android library project, follow these steps:

	Make sure that both the project library and the application project that depends on it are in your workspace. If one of the projects is missing, import it into your workspace.
	
	In the Package Explorer, right-click the dependent project and select Properties.
	
	In the Properties window, select the Android properties group at the left, and locate the Library property on the right.
	
	Click Add to open the Project Selection dialog.
	
	From the list of available library projects, select the google-play-services_lib project and click OK.
	
	When the dialog closes, click Apply in the Properties window.
	
	Click OK to close the Properties window.
	
7. Add a reference to the google-play-services version at your application's AndroidManifest.xml as the first child of the <application> element (If not done so already).
```
	<meta-data
	android:name="com.google.android.gms.version"
	android:value="@integer/google_play_services_version" />
```
8. This will result in a compile error, which you can correct by copying the file located at google-play-services_lib/res/values/version.xml into your application's res/values directory.
9. Finally, copy the android-support-v4.jar file into your project's libs directory. The JAR archive can be found at <Android_SDK_Location>/extras/android/support/v4.

Properties Configuration
---

Now, navigate to your app's overview page on [IBM Bluemix](https://www.bluemix.net) and copy your AppID, App Secret, and App Route into your 'assets\bluelist.properties' file.

NOTE: Your App Route will be in the format:

```
<YOUR_APP_NAME>.mybluemix.net
```

Add the Google API Project Number and GCM API Key into your application in Bluemix
---

1. From your app's overview page on [IBM Bluemix](https://www.bluemix.net) click on the Push service.
2. Under the Configuration tab of the Push service, click EDIT under Google Cloud Messaging. 
3. Fill in the GCM API Key and the Google API Project Number you got earlier from Google, and click SAVE.

Familiarize yourself with server-side Node.js
---

1. If you haven't already, download the [Node.js application](https://hub.jazz.net/git/mobilecloud/bluelist-push). The Node.js application is in the bluelist-push-node folder of the bluelist-push project.
2. Look through the 'bluelist-push-node/app.js' file and familiarize yourself with the code. Both the applicationID and applicationRoute values within the 'app.js' code need to be updated.

Import the Node.js application
---

1. Go to the Overview page for your application, and make note of your Application ID for BlueList.
2. Use the Cloud Foundry command-line interface: Download the [Cloud Foundry CLI version 6](https://github.com/cloudfoundry/cli/releases), and choose the installer appropriate for the system from which you will run the CLI.
3. Open a command prompt, and run the following command to verify proper installation:
```
cf --version
```
 If it installed properly, you will see a version returned.
4. Log in to [Bluemix](https://www.bluemix.net/?cm_mmc=developerWorks-_-dW%20CloudOE%20content-_-mo-android-push-app-_-article) from the CLI by running the command:
```
cf login -a https://api.ng.bluemix.net
```
5. From your command prompt, navigate to the bluelist-push/bluelist-push-node directory containing the Node.js application code.
6. List the directory contents to ensure that you see the app.js, manifest.yml, package.json, and the public directory.
7. Open app.js in a text editor, and add the App ID, and Application Route for your Mobile Cloud application on IBM Bluemix.
``` 
//configuration for application
var appConfig = {
    applicationId: "<INSERT_YOUR_APPLICATION_ID_HERE>",
    applicationRoute: "BlueList.mybluemix.net"
};
```
8. Push (upload) the bluelist-push-node application up to the Bluemix Node.js runtime by running the following command:
```
cf push BlueList -p .
```
9. Confirm that the following success message is returned in the command prompt:
	```
	1 of 1 instances running
	
	App started
	
	Showing health and status for app BlueList in org <your_org_name> / space <your_space> as yourid@ibm.com...
	OK
	
	requested state: started
	instances: 1/1
	usage: 512M x 1 instances
	urls: BlueList.mybluemix.net
	
		state     since                    cpu    memory          disk
	#0   running   2014-04-25 02:23:27 PM   0.0%   53.2M of 512M   34.7M of 1G
	```
10. The Node.js application should now be running.

Run The App
---

1. Run the up-to-date code in two separate emulators or devices.

	Note: Be sure your Android device supports Google APIs.
	
	In Eclipse, go to Project > Properties > Android.
	
	Make sure Google APIs for your API level is selected, and click Apply.
	
	Open the Android Virtual Device Manager, select your device, click Edit, and set the Target to Google APIs (Google Inc.) - API Level XX (where XX matches your API level).
	
2. Add some grocery list items.
3. Watch as each list gets updated!
4. Additionally, whenever you create, delete, or update an item on the BlueList, all devices registered with the Push service will receive a push notification sent from your Node.js hosted application!

Test sending notifications from Bluemix
---

1. Log in to [Bluemix](https://www.bluemix.net/?cm_mmc=developerWorks-_-dW%20CloudOE%20content-_-mo-android-push-app-_-article).
2. From the DASHBOARD view, click your application.
3. Click the Push service icon.
4. Click the Notification tab.
5. Fill in the Message text field with anything you want, and click NEXT.
6. Choose the Recipients, and click SEND.
7. Watch as your mobile device or emulator receives a push notification! 