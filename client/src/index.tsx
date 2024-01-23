import { render } from 'preact';
import { useState } from 'preact/hooks';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Resources } from './pages/resources.js';
import { Homepage } from './pages/home.jsx';
import { NotFound } from './pages/_404.jsx';
import { Login} from './pages/Authentication/login.js';
import { Register} from './pages/Authentication/register.js';
import Logout from './pages/Authentication/logout.js';
import {Profile} from './pages/Authentication/profile.js';
import {Read} from './pages/Reader/read.js';
// import Thesis from './pages/thesis.tsx';
import {Stream} from './pages/stream.js';
import {Advent} from './pages/advent.js';
import {Data} from './pages/data.js';

import './style.css';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

async function isAuthenticated () {
	try {
		const response = await fetch(API_URL+'/auth/check', { 
			credentials: 'include', 
		 });
		 console.log('RESPONSE', response)
		const profile = await response.json();
		return profile
	} catch (error) {
		console.log('ERROR', error);
	}

}

export function App() {
	const [profile, setProfile] = useState(null);
	// check if user is authenticated
	// if not, redirect to homepage
	// if yes, redirect to reader
	console.log("APP is on")
	if (!profile) {
		isAuthenticated().then((profile) => {
			setProfile(profile);
			console.log('User PROFILE', profile);
	
		});
	}


	if (!profile) {
		return null; // or a loading indicator
	}

	return (
		<LocationProvider>
			<Header profile={profile} />
			<main>
				<Router>
					<Route path="/" component={Homepage} />
					<Route path="/resources" component={Resources} />
					<Route path="/resource/:id" component={Read} /> 
					
					<Route path="/stream" component={Stream} />
					<Route path="/advent" component={Advent} />
					<Route path="/data" component={Data} />
					<Route default component={NotFound} />
					<Route path="/login" component={Login} profile={profile} />
					<Route path="/register" component={Register} profile={profile} />
					<Route path="/logout" component={Logout} />
					<Route path="/profile" component={Profile} profile={profile} />
				</Router>
			</main>
			<Footer />
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
