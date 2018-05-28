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
            return {
              firstName,
              lastName,
              handicapIndex,
              ghinNum,
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
  return {
    ghinNum: golfer.GHINNumber,
    firstName: golfer.FirstName,
    lastName: golfer.LastName,
    state: golfer.State,
    handicapIndex: golfer.Value,
    trend: golfer.TrendValue,
    gender: golfer.Gender,
    clubName: golfer.ClubName,
    email: golfer.Email.constructor === Object ? '' : golfer.Email,
    assocName: golfer.AssocName
  }
}

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
