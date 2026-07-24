// TODO: not supported in AppDB, needs manual JS join (reviewController.js, reportController.js populate user, tour, and aggregate avgRating, ratingsBreakdown)
import { createAdapter } from './baseAdapter.js';

const Review = createAdapter('reviews');

export default Review;
