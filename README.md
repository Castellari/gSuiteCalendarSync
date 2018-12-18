# gSuiteCalendarSync
## Project goal
This script was created as a temporary workarround for current Google Home limitation to access gSuite calendars (as of December 2018 Google Home won't access gSuite calendars).
### Workaround
This script mirrors your gSuite Calendar on a personal calendar on your gmail account. This script will automatically create, update and delete events on your personal calendar according to changes made in the gSuite account. By creating execution time trigger (for example every 1 one minute), the calendar is kept up to date.

All you need is your gSuite account and a personal gmail account.

There's no need to have any coding experience to use this script. You basically have to copy this script, update you calendar ID in the code and create a trigger (guide in the references) to run the script periodically. I encourage you to try to follow this guide even if you might be intimidated at first, I am sure you can use this! :)

### Warnings
Please create a new calendar in you personal account (as per instructions), because this script creates a perfect mirror of your gSuite - so it **will delete any events in target personal calendar that are not in the gSuite event.**

## How to setup code

#### 1. Create a new calendar on your personal gmail account
This calendar is where you will store a copy of your gSuite events. [Step by step instructions](https://support.google.com/calendar/answer/37095?hl=en)

Note that events not included on gSuite accout will be deleted from the personal calendar. To avoid any losses, create a new calendar in the gmail account.

#### 2. Share the new calendar with gSuite account (with option to make changes)
Share the new calendar with gSuite account. The sharing option must be allow gSuite to "make changes to events".
[step by step instructions](https://support.google.com/calendar/answer/37082?hl=en)

#### 3. Get the Calendar ID of the personal calendar 
Get the **Calendar ID** of the personal calendar where you'll store the gSuite events.
You can find it in the same page that you can share the calendar, scrolling down to the item **Integrate Calendar** 
(Hover over personal calendar > click the three vertical dots > settings and sharing)


#### 4. Create a new Google Script project, copy code.gs and replace the "personal calendar ID"
Create a [New Google Scrip Project](https://script.google.com/intro) **on your gSuite account** and paste the code.gs file.
Locate the text `<Personal calendar ID>` and replace it with the ID you copied from previous step. Be sure to keep the quote marks around the ID.

At this step, you can also change how many days in the future the script will copy from your gSuite calendar. 
The default values is 14 days. To change, change the value of `var maxDays = 14` (line 15) to how many days you want -- big numbers may cause performance issues.


#### 5. Create a trigger for the script to run every 1 minute
Create a trigger for the script to run every X minutes, this will allow for any changes to be reflected frequently on your personal calendar. I have this seted as 1 minute intervals to have updates as frequently as I can.

You can create the trigger on the script page at **Edit > Current project's triggers**, the click on **No triggers set up. Click here to add one now.** [More information](https://developers.google.com/apps-script/guides/triggers/installable#managing_triggers_manually)

#### 6. Run the script manually once and give permission
On menu "select function", select *PersonalCalendarSync*, click on the play button once and authorize the script to access your calendars.

At this point, you can check your personal calendar to see if the copied events appeared correctly.

#### 7. Give Google Home access to the new personal calendar
On Google Home app, go to **Account tab (user icon) > More Settings > Services Tab > Calendar** and check your new calendar

## How it works
Every event on a calendar has a unique ID, so everytime this script creates a new event on you personal calendar, it adds a tag (that is only accessible through scripts and is not accessible through calendar application) named `gSuiteEventID` with the ID of the gSuite event that the personal event is mirroing.

With this in mind, for every day in range, the script will check the gSuite events' IDs and compare with the tags on the events on the same day.

If the script will look for the corresponding ID, if it finds a match, it will check if the event needs to be updated and will perform updates. If script doesn't find a personal event with corresponding gSuite ID, it will create a new event and copy its information. If the script finds a personal event that has no corresponding event on gSuite calendar (e.g. when an event is deleted), it will delete the event on the personal calendar.
