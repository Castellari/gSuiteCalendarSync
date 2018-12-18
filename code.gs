function PersonalCalendarSync() {
  // set your personal calendar id (i.e. the target calendar that will be the mirror fo gSuite calendar)
  var personalGoogleAccountID = "<Personal Calendar ID>"

  // acquire a reference to your personal google account calendar
  var personalCalendar = CalendarApp.getCalendarById(personalGoogleAccountID)

  // acquire a reference to your default calendar (which will be relative to the account this script executes under)
  // note: this script should be executed within your g suite account for this lookup to work as expected
  var gSuiteCalendar = CalendarApp.getDefaultCalendar()
  
  // Initializing date variables to loop calendar
  // set maxDays to match days forward the script should update the calendar
  var day = new Date()
  var maxDays = 14

  
  //Initializing variables where we will store events for each day
  var gSuiteEvents
  var personalEvents
  
  //From today to next maxDays days (inclusive)
  for(d=0;d<=maxDays;d++){
    
    //Initializing a tracker array -- this is where we will compare two calendars and define actions to take
    var personalTracker = []
    
    //Get events on given day for gSuite Calendar
    gSuiteEvents = gSuiteCalendar.getEventsForDay(day)
  
    //Get events on given day for personal Calendar
    personalEvents = personalCalendar.getEventsForDay(day)
  
    
    //Populate the tracking array with each personal event
    //Initially, every event is marked as an event with no match in gSuite calendar
    for (var eventID in personalEvents) {
      personalTracker.push({
        personalEventID : personalEvents[eventID].getId(),
        updateStatus : "No Match",
        
        //When we create personal events with this script, we assign a key/value pair to personalEvent with gSuiteEvent Id so we can track any changes
        //If events weren't create with this script, this will return null
        gSuiteEventID : personalEvents[eventID].getTag("gSuiteEventID"),
        
        //We will have to pass event inside tracker because we are expiring issues getting full day events by getEventByID() method
        personalEvent : personalEvents[eventID]
      })
    }
    
  
  

    //We will loop every gSuite event and compare it with every personal event
    //We will assign personal events to be created, updated or deleted on the tracker array
    for (var gSuiteID in gSuiteEvents){
      //When we start checking, we assume all gSuiteEvents are new events
      var newEvent = true
      
      for (var personalID in personalEvents){
        if (gSuiteEvents[gSuiteID].getId()==personalEvents[personalID].getTag("gSuiteEventID")){
          personalTracker[personalID].updateStatus = "To update"
          
          //We will have to pass event inside tracker because we are expiring issues getting full day events by getEventByID() method
          personalTracker[personalID].gSuiteEvent = gSuiteEvents[gSuiteID]
          
          //Once event is found, set newEvent to false
          newEvent = false
        }
      }
            
      if (newEvent){
        personalTracker.push({
          personalEventID:null,
          updateStatus: "To Create",
          gSuiteEventID: gSuiteEvents[gSuiteID].getId(),
          
          //We will have to pass event inside tracker because we are expiring issues getting full day events by getEventByID() method
          gSuiteEvent: gSuiteEvents[gSuiteID]
        }) 
        
      }
    }
  
  
    //After we finished comparing every gSuite and personal Events
    //We will go through the tracker array and execute actions
    for(var i in personalTracker){
      if(personalTracker[i].updateStatus == "To Create"){
        //Create
        createPersonalEvent(personalCalendar,personalTracker[i])
      }
      else if(personalTracker[i].updateStatus == "To update"){
        //Update
        updatePersonalEvent(personalCalendar,personalTracker[i])
      }
      else if(personalTracker[i].updateStatus == "No Match"){
        //Delete
        deletePersonalEvent(personalCalendar,personalTracker[i])
      }
    }
    
    //We have experienced duplication of events during midnight
    //So we will run a function to remove duplicates from personal calendar
    //removeDuplicatedPersonalEvents(personalCalendar,day)
    
    
    //Loop to next day  
    day.setDate(day.getDate() + 1);
  
  }
}







function createPersonalEvent(personalCalendar,personalTracker) {
  
  //Getting information from the gSuite event
  var newEventgSuiteId = personalTracker.gSuiteEvent.getId()
  var newEventTitle = personalTracker.gSuiteEvent.getTitle()
  var newEventStartTime = new Date(personalTracker.gSuiteEvent.getStartTime())
  var newEventEndTime = new Date(personalTracker.gSuiteEvent.getEndTime())
  var newEventLocation = personalTracker.gSuiteEvent.getLocation()
  var newEventDescription = personalTracker.gSuiteEvent.getDescription()
  
  //Logger.log("I'm going to create event based on gSuite:")
  //Logger.log(newEventTitle)
  //Logger.log(newEventgSuiteId)
  
  //Creating new event and adding the gSuite ID in key/value pair
  var newEvent = personalCalendar.createEvent(newEventTitle, newEventStartTime, newEventEndTime, {Location:newEventLocation,Description:newEventDescription})
  newEvent.setTag("gSuiteEventID", newEventgSuiteId)
}





function deletePersonalEvent(personalCalendar,personalTracker){
  var deleteEvent = personalTracker.personalEvent
  deleteEvent.deleteEvent()
  //Logger.log("I'm going to delete personal Event:")
  //Logger.log(deleteEvent.getTitle())
  //Logger.log(deleteEvent.getId())
}




function updatePersonalEvent(personalCalendar,personalTracker){
  var personalEvent = personalTracker.personalEvent
  var gSuiteEvent = personalTracker.gSuiteEvent
  
  //Logger.log("I'm going to update personal Event:")
  //Logger.log(personalEvent.getTitle())
  //Logger.log(personalEvent.getId())
  //Logger.log("Based on gSuite event:")
  //Logger.log(gSuiteEvent.getTitle())
  //Logger.log(gSuiteEvent.getId())
  
  if(personalEvent.getTitle()!=gSuiteEvent.getTitle()){
    //Logger.log("Updating Title")
    personalEvent.setTitle(gSuiteEvent.getTitle())
  }
  
  //assigning variables to dates to make it easier to work with them
  var personalStartTime = new Date(personalEvent.getStartTime())
  var personalEndTime = new Date(personalEvent.getEndTime())  
  var gSuiteStartTime = new Date(gSuiteEvent.getStartTime())
  var gSuiteEndTime = new Date(gSuiteEvent.getEndTime())
  
  if(personalStartTime.getTime()!=gSuiteStartTime.getTime() || personalEndTime.getTime()!=gSuiteEndTime.getTime()){
    //Logger.log("Updating Time")
    personalEvent.setTime(gSuiteStartTime, gSuiteEndTime)
  }
  
  if(personalEvent.getLocation()!=gSuiteEvent.getLocation()){
    //Logger.log("Updating Location")
    personalEvent.setLocation(gSuiteEvent.getLocation())
  }
  
  if(personalEvent.getDescription()!=gSuiteEvent.getDescription()){
    //Logger.log("Updating Description")
    personalEvent.setDescription(gSuiteEvent.getDescription())
  }
}




function removeDuplicatedPersonalEvents(personalCalendar,day){
  var personalEvents = personalCalendar.getEventsForDay(day)
  
  
  //Array of events to delete
  var duplicatedEvents = []
  
  //For every event
  for (var eventID1 in personalEvents){
    
    //get gSuite Mirror event
    var gSuiteEventID1 = personalEvents[eventID1].getTag("gSuiteEventID") 
    
    //Loop events again to see duplicates
    for (var eventID2 in personalEvents) {
      //Check if event comes in a latter position (get only one of the duplicates and don't compare the same events)
      if (eventID2 > eventID1){
        var gSuiteEventID2 = personalEvents[eventID2].getTag("gSuiteEventID")    
        
        //if they mirror the same gSuiteEvent, delete them
        if (gSuiteEventID1 == gSuiteEventID2){          
          duplicatedEvents.push(personalEvents[eventID2].getId())
        }              
      }      
    }
  }
  
  //deleting duplicated events
  for(var i in duplicatedEvents){
    var eventToDelete = personalCalendar.getEventById(duplicatedEvents[i])
    eventToDelete.deleteEvent()
  }
 
}
