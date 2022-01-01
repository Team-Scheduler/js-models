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