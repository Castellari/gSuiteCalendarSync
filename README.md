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

Create a new calendar on your personal gmail account where you will store a copy of your gSuite events. Note that events not included on gSuite accout will be deleted from the personal calendar. To avoid any losses, create a new calendar in the gmail account
Share the new calendar with gSuite account. The sharing option must be allow gSuite to "make changes to events".</ol>
		<ol>Get the <strong>Calendar ID</strong> of the personal calendar where will save the copy of events. You can find it in the same page that you can share the calendar, under the item <strong>Integrate Calendar</strong></ol>
		<ol>Copy the script code on a new Google Script project. Replace the "personal calendar ID" text with the ID you copied from previous step. Set up how many days in the future will be updated on the personal calendar (default is 14 days)</ol>
		<ol>Create a trigger for the script to run every X minutes, this will allow for any changes to be reflected frequently on your personal calendar. I have this seted as 1 minute intervals</ol>
		<ol>Finally, give Google Assistant access to the personal calendar. On Google Home app, go to Account tab (user icon) > More Settings > Services Tab > Calendar > Check your new calendar</ol>


