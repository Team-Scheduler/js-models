# js-models

# All models are based on a NoSql database solution, like MongoDB #

Data Concepts:
==============

1.  The team is the upper level of the object hierarchy.  The team is normally 
group of sites, bound together by a contract, or group of contracts, which all 
the sites have in commonality.  The team can also have individuals associated
with a headquarters or main office who are associated with the management of the
contract and team personnel.  
    a. Reports: These people will normally need composite reports to verify 
    contract completion, so report production is focused on a compilation of 
    data from all the sites. These reports include:
        1) Contract completion forecasts
        2) Paid/Unpaid Time Off 
    b. Data Input: These people will maintain the high level input for the team.  
    This includes:
        1) Creation of sites and assignment of site leadership
        2) Information related to the contract(s)
        3) Company information, along with partner companies in the contract.
        4) Generic Codes for use in site scheduling, plus the corresponding 
        color coding for the codes.  These include (but not limited to): Shift 
        codes (D = Day, S = Swing, M = Mids) and Leave codes (P = PTO/Vacation, 
        H = Holiday, BR = Bereavement, PL/FL = Parental/Family Leave, UP = 
        Unpaid Time Off, etc).  The codes are to standardize the sites.
2.  The site is the next level in the object hierarchy.  The site is normally
a geographically separated entity of the team.  The geographical separation 
could be in different parts of the world or of the same building.  The idea is
that the site has some type of leadership responsible to the team leadership 
for the contract completion.  The leadership team is normally smaller than the
team leadership and they probably lead from the front while working on the 
contract work, not just a management function. The site will be further 
subdivided into workcenters where the people normally work. 
    a.  Site Leadership Positions (positions may be combined):
        - Site Lead and Alternate
        - Administrative Staff
        - Workcenter Leads
        - Site Scheduler
    b. Reports:  The site leadership is focused on the site's accomplishment of
    their respective portion of a contract or statement of work.  So the reports
    are focused on managing this.  These reports include:
        1) Site work schedule
        2) Site's contract completion forecasts
        3) Paid/Unpaid Time off
3.  The workcenter is where employees are assigned.  This next level in the 
object hierarchy allows employees to be grouped and shift coverage to be reviewed
to ensure the site can accomplish the contract tasks.
4.  The bottom of the object hierarchy is the employee.  This is at the bottom 
because employee can be moved between sites and workcenters within the team, but
you don't move a site or workcenter.  The employee's data is stored within a 
contained document in the database, with two exceptions: 1) Work data and 2) 
Leave data.  The two exceptions are in separate collections due to the probable
data size.  It is assumed that the server will compile the work and leave data, 
from the separate collections into a composite object to transfer.

# Models

## Team

### Team

The team object consists of an identifier and name/title for the team, plus 
arrays of objects for the team's associated data: Companies and company holidays,
Knowledge specialty areas, Personal contact information types and Display codes
for work and leaves.  The final array contains associated site data (see site
model description, below).

    1. Members
        - ID
        - Name
        - Companies
            - Holidays
        - DisplayCodes
        - Knowledge Area Groups
            - Knowledge areas
        - Contact Types
        - Sites
    2. Methods:

### Company

The company object consists of a code and title, plus a reference to the type
of time card system used for ingesting time card data.  Available time card 
systems (currently) are: SAP and manual.  Additionally, the company can list
all of the holidays an employee can use as days off within a calendar year.

    1. Members
        - Code
        - Title
        - Time Card System
        - Holidays
    2. Methods: 
        - CompareTo(another company) - used in sorting the team's companies
            based on code and title, alphabetically.

### Holiday

The holiday object consists of a company code and title for the holiday, a list
of actual/reference dates for the holiday (one per year), and display order 
property to allow the company to sort the holidays in a particular order.

    1.  Members
        - Code
        - Title
        - Display Order
        - Actual Dates list
    2.  Methods:
        - CompareTo(another holiday) - used in sorting the company's holidays
            based on display order, least first.

### ContactType

This contact type object is used to create a list of the various ways a member
of the team (or outside) can contact another member.  This could be a type of 
phone number, email address or other...

    1.  Members
        - Code (short title)
        - Description (long title)
        - IsRequired (boolean value whether the employee must have this 
            information in their data)
        - Display Order
    2.  Method:
        - CompareTo(another contact type) - used in sorting the contact types
            based on display order, least first.

### DisplayCode

This display code object is used to define the viewing color scheme for anything
schedule related.  The various codes can be displayed using differing background
and text colors to highlight the information to viewers.

    1.  Members
        - Code
        - Name (description)
        - BackColor (RGB Color in hex string)
        - TextColor (RGB Color in hex string)
        - IsLeave (boolean value to indicate the code is for leave definitions, 
            rather than shift codes)
        - Display Order
    2.  Method:
        - CompareTo(another display code) - used in sorting the display codes
            based on display order, least first.

## Site

### Site

The site object represents a separate element of the team.  It may be 
geographically or functionally separate, but is normally headed by a leader.
The site contains various work centers and site-level positions and derives 
its work from the team.  

    1.  Members
        - id (server designator for the site, used to identify the site within
        the system)
        - Code (short identifier for the site)
        - Title (longer descriptor for the site)
        - UTC-Difference (Universal Time Coordinate, Zulu Time, signifies the
        base time zone use by aviation and other functions.  UTC is based on 
        Greenwich Mean Time and the difference is the +/- 12 value for the 
        number of time zones before or after Greenwich)
        - Work Code List (The work codes assigned by the site for use.)
        - Labor Code List (The list of labor codes, assigned to the site by
        each company, to allow the site to track work accomplishment )
        - Work Center List (The list of available work centers at the site where
        site personnel will be assigned)
        - Employee List (This list is provided to allow the server to pass a 
        of employees assigned to the site)
    2.  Methods
        - CompareTo(another site) - used in sorting the team's sites based on
        code/title.

### Workcenter

The workcenter is the functional separation within a site to allow schedule
allotment and minimum manning levels.  A work center can have multiple shifts 
and/or positions to assign people to.

    1. Members
        - id (server designator for the work center, used to identifiy the work
        center with the system)
        - title (the string value for the work center, normally used to identify
        the functionality of the work center.  Examples: Lead Section, GEOINT, ...)
        - display order (this numeric value used for sorting the order to display
        the site's list of work centers)
        - position list (this list of positions/position objects assigned to 
        a single work center.  Examples: Site Lead, Shift Lead,...)
        - shift list (this list of shifts/shift objects allows site employees to
        be give a work schedule based on codes)
        - employee list (OPTIONAL) (This list allows the system to pass those
        individual assigned to the work center)
    2. Methods
        - CompareTo(another site) - used in sorting the site's work centers by
        the value of its display order value.

### Shift

The shift is normally a time slot within a day for employees to be assigned 
within.  In this application, shift assignments are completed by letter code
within the employee assignment objects.

    1.  Members
        - id (server designator to identify this particular shift)
        - title (a short descriptor for the shift.  Examples: Days, Mids, Swings)
        - display order (a numeric value for the order to display the different
        shifts within a work center)
        - shift code list (a list of strings identifying the assignment codes
        assigned to a shift)
        - minimums (a numeric value used to help identify when coverage for a
        particular shift is too low)
        - employee list (OPTIONAL) (this list allows the system to pass those
        individual assigned to a particular shift within the work center)
    2.  Methods
        - CompareTo(another site) - used in sorting the work center's shifts
        based on a display order value.

### Position

The position is normally used to assign an individual to a work center by the
function they complete within the work center.

    1.  Members
        - id (server designator to identify this particular position)
        - title (a short descriptor for the position an individual can be 
        assigned to)
        - IsDisplayed ( a boolean value to signify if a position is shown in a
        normal schedule)
        - display order (a numeric value for the order to display the different
        shifts within a work center)
        - employee list (OPTIONAL) (this list allows the system to pass those
        individual assigned to a particular position within the work center)
    2.  Methods
        - CompareTo(another site) - used in sorting the position within the
        work center.

### WorkCode

This workcode class is used to provide a standard start time for a work code
the site is using for scheduling.

    1.  Members
        - Code (a string value for a team's shift code list)
        - start time (a integer value (0 - 23) for the hour the code normally 
        begins)
    2.  Methods
        - CompareTo(another site) - used in sorting the workcode within a list.

## Labor Codes

Labor Codes are defined by a company to record contract hours completed.  The 
standard used, in this application, identifies a labor code using a charge 
number and an extension.  The combination of the two represents a single labor
code.  Labor Codes are assigned by the team to sites and employees.  This allows
the site to monitor its portion of contract completion.  Two classes are provided 
for labor code use/definition, one for site and another for employee.

### SiteLaborCode

The site labor code allows the site to define additional information for reports
and other uses, such as contract specific or minimum number of employees assigned
to a labor code within the site.

    1.  Members
        - charge number (the string value used as part of the labor code's key)
        - extension (the string value for the second part of the labor code's key)
        - company id (the identifier for the company assigning the labor code)
        - division (the department/sub-company, within the company, the labor is
        being completed for)
        - CLIN (Contract Line Number)
        - SLIN (Section Line Number)
        - WBS (?)
        - Location (The site's location or the code for the location)
        - minimums (The number of employees who will use this labor code at the
        site.)
        - Placecard for No Employee (a string value to be used in the schedule
        when the minimum number of employees are not available for a labor code)
        - Contract Hours per Employee (The number of hours assigned by the 
        contract for each employee)
        - IsExercise (a boolean flag meaning the labor code is additional hours
        employees would use for a special project)
        - Start Date (the first date the contract hours can be used)
        - End Date (the last date the contract hours can be used)
    2.  Methods
        - CompareTo(another site) - used in sorting the labor code within a list.

### EmployeeLaborCode

The employee labor code allows a site labor code to be assigned to an employee.  
It allows a forecast of hours to be compiled for an employee within the list
of site labor codes.

    1.  Members
        - charge number (the string value used as part of the labor code's key)
        - extension (the string value for the second part of the labor code's key)
        - company id (the identifier for the company assigning the labor code)
    2.  Methods
        - CompareTo(another site) - used in sorting the labor code within a list.

## Employee

### Employee

### Workday

The work day defines a day of work within a schedule.  It consists of the day id
within the schedule starting with 1, the work center, work code, starting time 
and the number of hours working on that day.

    1.  Members
        - day (an integer identifier for the day of the schedule, starting with
        1 and continuing to the total number of days in the schedule)
        - work center (an identifier used to show the work center, if any, the
        individual is working at on the day indicated)
        - work code (a string code, letter, used to identify the shift the 
        individual is working that day)
        - start hour (a numeric value (0-23) to indicate the individual projected
        actual start hour, -1 is used on days normally off.)
        - hours worked (a numeric value to indicate the number of hours expected
        to be worked by the individual on that day)
    2.  Methods
        - CompareTo (another work day) - used in sorting work days within a
        schedule.

### Schedule

This object signifies a specified number of days which an individual rotates 
through for his/her projected schedule.  The number of days must be a multiple
of seven (7) because the schedule is based on number of weeks and also always 
starts on a Sunday.

    1.  Members
        - id (identifer within the assignment, assigned by the assignment)
        - days in schedule (a numeric value (multiple of 7) to indicate the 
        total number of days the schedule uses.  It must correspond with the 
        number of workdays assigned)
        - work day list (the list of work days which define the individual days
        within the schedule.  The number of work days must be equal to the 
        number of days assigned above.)
    2.  Methods
        - CompareTo (another schedule) - used for sorting the schedules within
        an assignment.
        - setDaysInSchedule - will change the number of days in a schedule and
        will check to ensure the number is a multiple of 7 but greater than zero,
        then create the workdays in the array to correspond to this value.  Can
        return an error for values not a multiple of 7 or equal to zero (0).
        - setWorkDay - sets the workday values within the workday array 
        corresponding to the day provided

### Assignment

This object is used to provide a set of schedules for a defined period of time.
An end date in the year 9999 is to signify a schedule that doesn't have an end,
only one of the employee's assignments may be open ended at any time.

    1.  Members
        - id (a server provided designator for the assigment)
        - start date (the date the assignment goes into affect.  The default
        value is a zero date.)
        - end date (the last day the assignment is in affect.  The default value
        is assigned as 31 Dec 9999 and considered open ended.)
        - site (A string value for the site, normally the site code from the
        team object)
        - days in rotation (a numeric value to show the number of days between
        changes in the schedules in the assignment)
        - job title (a string value for the employee's job title during the
        period of the assignment)
        - schedules (a list of schedule which hold the work days)
    2.  Methods
        - CompareTo(another assignment) - used to sort assignments based on 
        start and end dates.
        - AddSchedule(number of days) - Add another schedule with the number
        of days in the workday list.
        - IsActiveOnDate(date) - provides a boolean value to show whether this
        assignment is active (between the start and end dates).
        - IsActiveDuringPeriod(date, date) - provides a boolean value to show
        whether this assignment is active during any date in the period defined
        by the two dates given.
        - GetSchedule(date) - provides the schedule object from the list of
        schedules based on the date compared to the assignment start date and
        the number of days in the rotation.
        - GetWorkday(date) - provides the workday object from the list of 
        schedules, using the schedule provided in the GetSchedule method and the
        day calculated within the schedule.
        - GetWorkcenterForPeriod(date, date) - provides the identifier and the
        number of days in that workcenter (whichever is greatest amount of days).
        Both values are provided in case several assignments are valid in the
        period.
        - GetStandardDailyHours() - provides the greatest number of hours worked
        in the default or first schedule of the assignment's schedule list.

### Variation

This object represents a special type of assignment, specifically an assignment
variation.  A variation, for the same date, supercedes a regular assignment when 
determining an employee's work schedule.  The variation is normally a short term
change to the normal assignment, like working mids for a week, month or so and 
when the employee returns to normal work, he/she will resume the previously used
assignment to determine their respective schedule.  A variation can only have 
one schedule but the schedule can have any multiple of 7 for it's respective
workdays.  A variation also can start and stop in mid-week, which allows the 
start of the variation and the resumption of schedule on specified dates.

    1.  Members
        - id (a server designator for this variation)
        - start date (the first day that the variation will start to supersede the 
        current assigment)
        - stop date (this last day the variation supersedes the current assignment)
        - IsMids (a boolean flag to indicate that the variation is part of a 
        rotating mids schedule)
        - schedule (the schedule object for the variation, this must have a
        multiple of 7 days, starting on Sunday)
    2.  Methods
        - CompareTo (another variation) - use in sorting variations for an
        employee using the start and end dates.
        - IsActive(date) - a boolean flag to indicate whether the variation is
        applicable on the date.
        - GetWorkday(date) - provides the Workday object for the date provided
        - SetWorkday(day number, code string, workcenter-id string, 
            start-hour number, hours-worked number) - sets the workday for the
            day provided, with the rest of the information.