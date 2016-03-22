title: Time Zone Applied in UI Format
date: 2015-11-30 13:44:35
categories:
- UI Development
- Javascript
tags:
- Javascript
---

Talking about Date, it is meaningless without definition of timezone.
So, it is important to enable convert time between local and UTC.

## Local Time -> UTC

    // Create Date object for current location
    var d = new Date();

    // Get current time zone info
    // Return offset unit by MINUTE
    // For example: "UTC+8" = -480
    var timeZoneOffset = d.getTimezoneOffset();

    // Transform MINUTE to MILLISECOND
    var offsetMsecs = timeZoneOffset * 60000;

    // Obtain UTC time in msec
    var utcTime = d.getTime() + offsetMsecs;

    // Convert UTC time value to date string
    var utcDate = new Date(utcTime);

## UTC -> Local Time

    // Input
    var d,              // UTC Date Object
        timeZoneOffset; // Timezone Offset Minute (-480)

    // Transform MINUTE to MILLISECOND
    var offsetMsecs = timeZoneOffset * 60000;

    // Obtain local time in msec
    var localTime = d.getTime() - offsetMsecs;

    // Convert local time value to date string
    var localDate = new Date(localTime);

