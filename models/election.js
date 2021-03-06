import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import calculatePluralityResults from "./methods/election/calculatePluralityResults";
import isVotingPeriod from "./methods/election/isVotingPeriod";
import getEligibleVoters from "./methods/election/getNumEligibleVoters";
import verifyUserCanVote from "./methods/election/verifyUserCanVote";
import findElectionByUrl from "./statics/election/findByUrl";
import queryElections from "./statics/election/queryElections";
import { customAlphabet } from "nanoid";
import calculateRunoffResults from "./methods/election/calculateRunoffResults";

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);
const Schema = mongoose.Schema;

const ElectionSchema = new Schema({
  name: String,
  url: String,
  allowedGradYears: [Number],
  pictureId: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["runoff", "plurality"],
    default: "plurality",
  },
  start: Date,
  end: Date,
  completed: Boolean,

  // Ids of all of the users who voted
  voterIds: [Schema.Types.ObjectId],

  runoffVotes: {
    type: [
      {
        id: {
          type: String,
          default: () => nanoid(),
        },
        gradYear: Number,
        choices: [Schema.Types.ObjectId],
      },
    ],

    // We don't want the votes to be included when we query an election until we explicitly ask for it
    select: false,
  },

  runoffResults: {
    rounds: [
      {
        number: Number,
        numVotes: Number,
        results: [
          {
            candidateId: Schema.Types.ObjectId,
            eliminated: Boolean,
            percentage: Number,
            numVotes: Number,
          },
        ],
        eliminatedCandidateIds: [Schema.Types.ObjectId],
      },
    ],
    winnerId: Schema.Types.ObjectId,
    totalVotes: Number,
    isTie: Boolean,
    numEligibleVoters: Number,
  },

  pluralityVotes: {
    type: [
      {
        id: {
          type: String,
          default: () => nanoid(),
        },
        gradYear: Number,
        choice: Schema.Types.ObjectId,
      },
    ],
    select: false,
  },

  pluralityResults: {
    candidateResults: [
      {
        candidateId: Schema.Types.ObjectId,
        percentage: Number,
        numVotes: Number,
      },
    ],
    winnerId: Schema.Types.ObjectId,
    isTie: Boolean,
    totalVotes: Number,
    numEligibleVoters: Number,
  },
});

ElectionSchema.methods.isVotingPeriod = isVotingPeriod;
ElectionSchema.methods.getNumEligibleVoters = getEligibleVoters;

ElectionSchema.methods.calculatePluralityResults = calculatePluralityResults;
ElectionSchema.methods.calculateRunoffResults = calculateRunoffResults;

ElectionSchema.methods.verifyUserCanVote = verifyUserCanVote;

ElectionSchema.statics.idLoader = findOneLoaderFactory("Election");
ElectionSchema.statics.urlLoader = findOneLoaderFactory("Election", "url");

ElectionSchema.statics.findByUrl = findElectionByUrl;
ElectionSchema.statics.queryElections = queryElections;
ElectionSchema.statics.nanoid = nanoid;

const Election =
  mongoose.models.Election || mongoose.model("Election", ElectionSchema);

export default Election;
