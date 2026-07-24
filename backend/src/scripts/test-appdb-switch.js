import { Tour as TourReal, Booking as BookingReal } from '../config/dbSwitch.js';

console.log('=== DB_MODE undefined / default (Real/Mongoose Mode) ===');
console.log('Tour Model:', TourReal.modelName || TourReal.name || 'Mongoose Model');
console.log('Booking Model:', BookingReal.modelName || BookingReal.name || 'Mongoose Model');

process.env.DB_MODE = 'appdb';

// Re-import dynamically to reflect process.env.DB_MODE change
const { Tour: TourAppDB, Booking: BookingAppDB } = await import(`../config/dbSwitch.js?t=${Date.now()}`);

console.log('\n=== DB_MODE = appdb (AppDB Adapter Mode) ===');
console.log('Tour AppDB Adapter Methods:', Object.keys(TourAppDB));
console.log('Booking AppDB Adapter Methods:', Object.keys(BookingAppDB));

// Test basic CRUD operations on AppDB adapter
const newTour = await TourAppDB.create({ title: 'AppDB Test Tour', price: 299 });
console.log('\nCreated AppDB Tour Document:', newTour);

const toursFound = await TourAppDB.find({ title: 'AppDB Test Tour' });
console.log('Found AppDB Tours:', toursFound);

const foundById = await TourAppDB.findById(newTour._id);
console.log('FindById AppDB Tour Document:', foundById);

const updatedTour = await TourAppDB.findByIdAndUpdate(newTour._id, { price: 349 });
console.log('Updated AppDB Tour Document:', updatedTour);

console.log('\nAll AppDB adapter methods executed successfully!');
