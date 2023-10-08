const mongoose = require('mongoose');


const slotSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    slotes: {
        type: [{
            slotTime: {
                type: String,
                required: true,
            },
            date: {
                type: Date
            },
            slotDate: {
                type: String,
                required: true,
            },
            isBooked: {
                type: Boolean,
                required: true,
                default: false
            },
        }],
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
