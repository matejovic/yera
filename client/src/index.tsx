import { render } from 'preact';
import { useState } from 'preact/hooks';
import { LocationProvider, Router, Route } from 'preact-iso';
import './style.css';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Homepage } from './pages/home.jsx';
import { Resources } from './pages/resources.js';
import { Read } from './pages/Reader/read.js';
import { Register } from './pages/Authentication/register.js';
import { Profile } from './pages/Authentication/profile.js';
import { Login } from './pages/Authentication/login.js';
import Logout from './pages/Authentication/logout.js';
// import Thesis from './pages/thesis.tsx';
import { NotFound } from './pages/_404.jsx';
// import {Advent} from './pages/advent.js';
// import {Data} from './pages/data.js';
// import {Stream} from './pages/stream.js';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

async function isAuthenticated () {
	try {
		const response = await fetch(API_URL + '/auth/check', { 
			credentials: 'include', 
		 });
		const profile = await response.json();
		return profile
	} catch (error) {
		console.log('ERROR', error);
		alert('credentials loading error in console. pls fix.');
	}
}

export function App() {
	const [profile, setProfile] = useState(null);
	
	if (!profile) {
		isAuthenticated().then((profile) => setProfile(profile));
	}
	
	return (
		<LocationProvider>
			<Header profile={profile} />
			<main>
				<Router>
					<Route path="/" component={Homepage} />
					<Route path="/advent" component={Advent} />
					<Route path="/resources" component={Resources} />
					<Route path="/resource/:id" component={Read} /> 
					<Route path="/thesis" component={NotFound} />
					<Route path="/logout" component={Logout} />
					<Route path="/login" component={Login} profile={profile} />
					<Route path="/register" component={Register} profile={profile} />
					<Route path="/profile" component={Profile} profile={profile} />
					<Route default component={NotFound} />
				</Router>
			</main>
			<Footer />
		>
		</LocationProvider>
	

render(<App />, document.getElementById('app'));