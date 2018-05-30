const { GraphQLServer } = require("graphql-yoga");
const fetch = require("node-fetch");
const parser = require("xml2json");

const appGhinURL = `http://209.235.230.179/ghponline/dataservices/`;
const appGhinPassword = process.env.GHIN_KEY || "enter-key-here";

if (!appGhinPassword) {
  throw new Error(
    "Please provide an API key for GHIN in the environment variable GHIN_KEY.  Enter command export GHIN_KEY='your-key'"
  );
}

const resolvers = {
  Query: {
    getGolferById: (root, args, context, info) => {
      return fetch(
        `${appGhinURL}golfermethods.asmx/FindGolfer?userName=nstart18&password=${appGhinPassword}&ghinNumber=${
          args.id
        }&association=0&club=0&service=0&lastName=&firstName=&gender=&activeOnly=true&includeLowHandicapIndex=false&includeAffiliateClubs=false`
      )
        .then(res => res.text())
        .then(body => {
          if (body.length < 600 && body.search("Login Failed")) {
            console.log("Login Failed");
            return null;
          }
          const golfer = parser.toJson(body, { object: true });
          if (golfer.ArrayOfGolfer.Golfer) {
            const firstName = golfer.ArrayOfGolfer.Golfer.FirstName;
            const lastName = golfer.ArrayOfGolfer.Golfer.LastName;
            const ghinNum = args.id;
            const state = golfer.ArrayOfGolfer.Golfer.State;
            const handicapIndex = golfer.ArrayOfGolfer.Golfer.Value;
            const trend = golfer.ArrayOfGolfer.Golfer.TrendValue;
            const address1 = golfer.ArrayOfGolfer.Golfer.Address1;
            const address2 = golfer.ArrayOfGolfer.Golfer.Address2;
            const city = golfer.ArrayOfGolfer.Golfer.City;
            return {
              firstName,
              lastName,
              handicapIndex,
              ghinNum,
              address1,
              address2,
              city,
              state,
              trend
            };
          } else {
            return null;
          }
        });
    },
    getGolfers: (root, args, context, info) => {
      return fetch(
        `${appGhinURL}golfermethods.asmx/FindGolferNameState?userName=nstart18&password=${appGhinPassword}&lastName=${
          args.lastName
        }&firstName=${args.firstName}&state=${args.state}&activeOnly=true`
      )
        .then(res => res.text())
        .then(body => {
          try {
            //console.log('body:', body, 'size:', body.length);
            if (body.length < 600 && body.search("Login Failed")) {
              console.log("Login Failed");
              return { golferCount: 0, golfers: [] };
            }
            const golfer = parser.toJson(body, { object: true });
            //console.log('golfer:', golfer);
            let golferCount = 0;
            let golfers = [];
            //console.log('golfer.ArrayOfGolfer.Golfer:', golfer.ArrayOfGolfer.Golfer);
            //console.log('golfer.ArrayOfGolfer.Golfer[golferCount]:', golfer.ArrayOfGolfer.Golfer[golferCount])
            while (golfer.ArrayOfGolfer.Golfer[golferCount]) {
              // array of golfers
              golfers.push(extractGolferObject(golfer.ArrayOfGolfer.Golfer[golferCount]));
              golferCount++;
            }
            if (!golferCount && golfer.ArrayOfGolfer.Golfer) {
              // we have a single golfer
              golfers.push(extractGolferObject(golfer.ArrayOfGolfer.Golfer));
              golferCount++;
            }
            console.log("golferCount:", golferCount);
            return { golferCount, golfers };
          } catch (err) {
            // no golfers found
            console.log("no golfers xml, err", err);
            //console.log('getGolfers error:', err);
            return { golferCount: 0, golfers: [] };
          }
        });
    }
  }
};

function extractGolferObject(golfer) {
  //console.log('golfer:', golfer);
  //console.log('email: ', golfer.Email, ', stringify:', JSON.stringify(golfer.Email), ', typeof:', typeof(golfer.Email));
  return {
    ghinNum: golfer.GHINNumber,
    firstName: golfer.FirstName,
    lastName: golfer.LastName,
    address1: typeof(golfer.Address1) != 'undefined' && golfer.Address1.constructor === Object ? '' : golfer.Address1,
    address1: typeof(golfer.Address2) != 'undefined' && golfer.Address2.constructor === Object ? '' : golfer.Address2,
    city: typeof(golfer.City) != 'undefined' && golfer.City.constructor === Object ? '' : golfer.City,
    state: typeof(golfer.State) != 'undefined' && golfer.State.constructor === Object ? '' : golfer.State,
    handicapIndex: golfer.Value,
    trend: golfer.TrendValue,
    gender: golfer.Gender,
    clubName: golfer.ClubName,
    email: typeof(golfer.Email) != 'undefined' && golfer.Email.constructor === Object ? '' : golfer.Email,
    assocName: golfer.AssocName
  }
}

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
