import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING } from 'sequelize';

import { User } from './models';

import crypto from "crypto";

const sequelize = new Sequelize('login-with-metamask-database', '', undefined, {
	dialect: 'sqlite',
	storage: path.join(os.tmpdir(), 'db.sqlite'),
	logging: false,
});

// Init all models
User.init(
	{
		nonce: {
			allowNull: false,
			type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
			defaultValue: (): number => crypto.randomInt(0, 10000),
		},
		publicAddress: {
			allowNull: false,
			type: STRING,
			unique: true,
			validate: { isLowercase: true },
		},
		username: {
			type: STRING,
			unique: true,
		},
	},
	{
		modelName: 'user',
		sequelize, // This bit is important
		timestamps: false,
	}
);

// Create new tables
sequelize.sync();

export { sequelize };
