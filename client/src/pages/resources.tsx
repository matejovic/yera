import { useState, useEffect } from 'preact/hooks';
import './style.css';
import Modal from '../components/Modal';


console.log(import.meta.env.MODE);

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

export function Resources() {

	// const [showModal, setShowModal] = useState(false);
	// const [bookmarkData, setBookmarkData] = useState(null);
	const [resources, setResources] = useState([]);

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (event.key === "Enter") {
				const url = event.target.value;
				const response = await fetch(API_URL + "/entry", {
						method: "POST",
						credentials: "include",
						headers: {
								"Content-Type": "application/json"
						},
						body: JSON.stringify({ url, type: 'resource-html' })
				});
				const data = await response.json();

				
				// TODO: redirect to new bookmark page
				console.log(data);
				window.location = `/resource/${data.id}`
		}
	};

	// const handleCloseModal = () => {
	// 		setShowModal(false);
	// 		setBookmarkData(null);
	// };

useEffect(() => {
	const fetchResources = async () => {
		// TODO: filter by type for resources only
		const response = await fetch(API_URL +"/entries", {
			credentials: 'include'
		});
		const data = await response.json();
		setResources(data);
		console.log('resources were set', data)
	};
	fetchResources();
}, []);

const handleClick = async (id) => {
	// navigate to url
	window.location = `/resource/${id}`
}

	return (
		<div class="home">

			<div className="newUrl">
				<input type="text" placeholder="https://" onKeyDown={handleKeyDown} />
			</div>
			<section class="reading-list">
				{resources && resources.length ? resources.map(resource => (
					<ContentRow
						title={resource.title}
						url={resource.url}
						createdAt={resource.created_at}
						tags={ resource.tags ? resource.tags.map(t => t.name) : []}
						clickAction={() => handleClick(resource.id)}
					/>
				)) : (<div>Your list is empty.</div>)}
			</section>
		</div>
	);
}

function ContentRow(props) {
	return (
		<a href={props.href} target="_blank" class="read-item" onClick={props.clickAction}>
			<div className="read-item__left">
				<h2>{props.title}</h2>
				<span>{props.url}</span>
			</div>
			<div className="read-item__right">
				<div className="tags">
					{props.tags && props.tags.map((tag) => (
						<span>#{tag}</span>
					))}
				</div>
				<div className="datetime">
					<span>Added: {props.createdAt}</span>
				</div>
			</div>
		</a>
	);
}
