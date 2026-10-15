import {getSql} from '../../../lib/db.js';
import {createTripHandlers} from '../../../lib/trip-storage.mjs';
export const dynamic = 'force-dynamic';
const handlers=createTripHandlers({getSql});
export const GET=handlers.GET;
export const POST=handlers.POST;
export const DELETE=handlers.DELETE;

