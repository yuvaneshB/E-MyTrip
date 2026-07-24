// TODO: not supported in AppDB, needs manual JS join (tourController.js, chatbotController.js populate category, destinations)
import { createAdapter } from './baseAdapter.js';

const Tour = createAdapter('tours');

export default Tour;
