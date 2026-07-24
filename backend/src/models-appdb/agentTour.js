// TODO: not supported in AppDB, needs manual JS join (agentTourController.js, destinationController.js populate category, destinations)
import { createAdapter } from './baseAdapter.js';

const AgentTour = createAdapter('agentTours');

export default AgentTour;
