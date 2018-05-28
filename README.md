# graphql-ghin-wrapper

GraphQL wrapper API for the [Golf Handicap and Information Network](http://www.ghin.com/) (GHIN).  The GHIN system is used to track and calculate golfer handicaps.

## Supported Functions

This version supports the following Queries:

* getGolferById - Lookup golfer details by their GHIN number
* getGolfers - Find golfers by name

## Usage

```sh
git clone https://github.com/rgstephens/graphql-ghin-wrapper.git
cd graphql-rest-wrapper
yarn
yarn start
```

Before running the server, you **must set the GHIN password** either by setting the **GHIN_KEY** environment variable or setting the it in the **index.js** file.

## Example Queries

Find golfer by GHIN Number

```json
{
  getGolferById(id: "331518") {
    ghinNum
    firstName
    lastName
    state
    handicapIndex
    trend
  }
}
```

Find golfer by Name & State

```json
{
    getGolfers(state: "WA", lastName: "Smith", firstName: "B") {
        golferCount
        golfers {
          ghinNum
          firstName
          lastName
          trend
          handicapIndex
          email
          clubName
        }
    }
}
```

# ToDo

* Courses interface
* Recent scores
* Revision scores
* Tournament scores
* Post scores
* Handicap history

# GHIN Mobile App API

### Find Golfer by Id

```
GET /ghponline/dataservices/golfermethods.asmx/FindGolfer?userName=nstart18&password=29&ghinNumber=3315181&association=0&club=0&service=0&lastName=Stephens&firstName=&gender=&activeOnly=true&includeLowHandicapIndex=false&includeAffiliateClubs=false
```

### Find Golfer by Name

```
GET /ghponline/dataservices/golfermethods.asmx/FindGolferNameState?userName=nstart18&password=29&lastName=Halliday&firstName=&state=WA&activeOnly=true
```

### Recent Scores

```
GET /ghponline/dataservices/scoremethods.asmx/MostRecentScoresFilterDetailed?datePlayedBegin=1%2F1%2F1900&datePlayedEnd=5%2F26%2F2018&teeAssociationNumber=0&teeClubNumber=0&teeCourseNumber=0&teeTeeNumber=0&scoreLow=0&scoreHigh=0&scoreType=All&courseName=&userName=nstart18&password=293&ghinNumber=3315181&scoreCount=20
```

## Reference

https://github.com/nikolasburk/graphql-rest-wrapper
