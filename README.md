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

Models
======

Team
----

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

Company
-------

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

Holiday
-------

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

ContactType
-----------

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

DisplayCode
-----------

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

Site
----

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

Workcenter
----------

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

Shift
-----

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

Position
--------

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