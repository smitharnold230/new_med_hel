const { User, Medicine, initDatabase } = require('./models');

const seedMedicines = async () => {
    try {
        await initDatabase();
        console.log('✅ Connected to database');

        const user = await User.findOne({ where: { name: 'Arnold' } });
        if (!user) {
            console.error('❌ User Arnold not found');
            process.exit(1);
        }

        await Medicine.create({
            userId: user.id,
            name: 'Vitamin D3',
            dosage: '1000 IU',
            frequency: 'Daily',
            time: '09:00',
            instructions: 'Take with breakfast',
            isActive: true
        });

        await Medicine.create({
            userId: user.id,
            name: 'Omega-3',
            dosage: '1 capsule',
            frequency: 'Daily',
            time: '13:00',
            instructions: 'After lunch',
            isActive: true
        });

        console.log('✅ Added sample medicines for Arnold');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding medicines:', error);
        process.exit(1);
    }
};

seedMedicines();
