// TODO: not supported in AppDB, needs manual JS join (destinationController.js, tourController.js populate category, city, country)
import { createAdapter } from './baseAdapter.js';

const Destination = createAdapter('destinations');

export default Destination;
