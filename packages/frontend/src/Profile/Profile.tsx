import './Profile.css';

import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
//import { stringify } from 'flatted';
//import Messenger from "./messenger.js";
/* tslint:disable no-var-requires */
/*
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
*/
import { Auth } from '../types';

interface Props {
	auth: Auth;
	onLoggedOut: () => void;
}

interface State {
	loading: boolean;
	user?: {
		id: number;
		username: string;
	};
	username: string;
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

export const Profile = ({ auth, onLoggedOut }: Props): JSX.Element => {
	const [state, setState] = useState<State>({
		loading: false,
		user: undefined,
		username: '',
	});

	useEffect(() => {
		const { accessToken } = auth;
		const {
			payload: { id },
		} = jwtDecode<JwtDecoded>(accessToken);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => setState({ ...state, user }))
			.catch(window.alert);
	}, []);

	const handleChange = ({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, username: value });
	};

	const handleSubmit = () => {
		const { accessToken } = auth;
		const { user, username } = state;

		setState({ ...state, loading: true });

		if (!user) {
			window.alert(
				'The user id has not been fetched yet. Please try again in 5 seconds.'
			);
			return;
		}

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
			body: JSON.stringify({ username }),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
		})
			.then((response) => response.json())
			.then((user) => setState({ ...state, loading: false, user }))
			.catch((err) => {
				window.alert(err);
				setState({ ...state, loading: false });
			});
	};

	const { accessToken } = auth;

	const {
		payload: { publicAddress },
	} = jwtDecode<JwtDecoded>(accessToken);

	const { loading, user } = state;

	const username = user && user.username;

	const clearAll = () => {
		const msg = document.getElementById('messages') as HTMLInputElement;
		msg.innerHTML = '';
	};

	const addMessage = () => {
		const input = document.getElementById('input') as HTMLInputElement;
		let inputval = input.value;
		if (inputval) {
			if (username && username.trim()) {
				inputval = username + ': ' + inputval;
			} else {
				inputval = 'Anonymous: ' + inputval;
			}
			const msg = document.getElementById('messages') as HTMLInputElement;
			const item = document.createElement('li');
			item.textContent = inputval;
			msg.appendChild(item);
			sendMessage(inputval);
			//getMessage();
			input.value = '';
		}
	};

	const sendMessage = (message: string) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
			body: message,
			headers: {
				'Content-Type': message,
			},
			method: 'POST',
		});
	/*
			.then((res) => res.text())
			.then((text) => {
				const msg = document.getElementById(
					'messages'
				) as HTMLInputElement;
				const item = document.createElement('li');
				item.textContent = text;
				msg.appendChild(item);
			});
			*/

	const getMessages = () =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
			.then((res) => res.text())
			.then((text) => {
				const msg = document.getElementById(
					'messages'
				) as HTMLInputElement;
				const messages = JSON.parse(text);
				for (const message of messages) {
					const item = document.createElement('li');
					item.textContent = message;
					msg.appendChild(item);
				}
			});

	const refresh = () => {
		window.location.reload();
	};

	const deleteMessages = () =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'DELETE',
		});

	const clearMessages = () => {
		deleteMessages();
		refresh();
	};

	window.onload = getMessages;

	return (
		<body>
			<div className="Profile">
				<div>
					My username is{''}
					{username ? <pre>{username}</pre> : 'not set.'}
					<br></br>
					My public address is <pre>{publicAddress}</pre>
				</div>
				<div>
					<label htmlFor="username">Change username: </label>
					<input name="username" onChange={handleChange} />
					<button disabled={loading} onClick={handleSubmit}>
						Submit
					</button>
				</div>
				<p>
					<button onClick={onLoggedOut}>Log out</button>
				</p>
			</div>
			<ul id="messages"></ul>
			<form id="form" action="">
				<input id="input" autoComplete="off" />
				<button type="button" onClick={addMessage}>
					Send
				</button>
				<button type="button" onClick={refresh}>
					Refresh
				</button>
				<button type="button" onClick={clearMessages}>
					Clear all
				</button>
			</form>
			<script src="/socket.io/socket.io.js"></script>
			<script src="packages\frontend\src\Profile\chat.js"></script>
		</body>
	);
};
