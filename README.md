# graphql-ghin-wrapper

GraphQL wrapper API for the [Golf Handicap and Information Network](http://www.ghin.com/) (GHIN).  The GHIN system is used to track and calculate golfer handicaps.

This GraphQL server uses the [Apollo Server](https://github.com/apollographql/apollo-server) with [graphql-yoga](https://github.com/prismagraphql/graphql-yoga).

## Supported Functions

This version supports the following Queries:

* getGolferById - Lookup golfer details by their GHIN number
* getGolfers - Find golfers by name

## Usage

```sh
git clone https://github.com/rgstephens/graphql-ghin-wrapper.git
cd graphql-ghin-wrapper
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

* GraphQL response error message for Login Failed
* Courses interface
* Recent scores
* Revision scores
* Tournament scores
* Post scores
* Handicap history

# systemd File

The `graphql-ghin.sevice` file is included to start the GHIN Wrapper as a systemd service. The file is typically placed in the `/lib/systemd/system` directory. 

You will need to change the **User** and **WorkingDirectory** values in the systemd file for your system.

The related commands to enable, start and stop the service are:

```
sudo systemctl daemon-reload
sudo systemctl enable graphql-ghin
sudo systemctl is-enabled graphql-ghin
sudo systemctl start graphql-ghin
sudo systemctl stop graphql-ghin
sudo systemctl status graphql-ghin
journalctl -u graphql-ghin.service
```

# https Support

```
sudo certbot certonly --webroot -w /home/greg/graphql-ghin-wrapper -d gstephens.org -d www.gstephens.org -m nworksgreg@gmail.com --agree-tos --no-eff-email
```

# GHIN Mobile App API

### Find Golfer by Id

```
GET /ghponline/dataservices/golfermethods.asmx/FindGolfer?userName=nstart18&password=29&ghinNumber=3315181&association=0&club=0&service=0&lastName=Stephens&firstName=&gender=&activeOnly=true&includeLowHandicapIndex=false&includeAffiliateClubs=false
```

### Find Golfer by Name

```
GET /ghponline/dataservices/golfermethods.asmx/FindGolferNameState?userName=nstart18&password=29&lastName=Halliday&firstName=&state=WA&activeOnly=true
```

```
GET /ghponline/dataservices/golfermethods.asmx/FindGolferNameState?userName=nstart18&password=29&lastName=Halliday&firstName=&state=WA&activeOnly=true
```

### Recent Scores

```
GET /ghponline/dataservices/scoremethods.asmx/MostRecentScoresFilterDetailed?datePlayedBegin=1%2F1%2F1900&datePlayedEnd=5%2F26%2F2018&teeAssociationNumber=0&teeClubNumber=0&teeCourseNumber=0&teeTeeNumber=0&scoreLow=0&scoreHigh=0&scoreType=All&courseName=&userName=nstart18&password=293&ghinNumber=3315181&scoreCount=20
```

## Reference

https://github.com/nikolasburk/graphql-rest-wrapper
